require('dotenv').config();
require('express-async-errors');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const db = require('./models');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//cors
const whitelist = process.env.REMOTE_CLIENT_APP.split(',');
const corOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corOptions));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret'));

app.use('/uploads', express.static(__dirname + '/uploads'));

//routers
const adminRouter = require('./routers/admin');
const contactRouter = require('./routers/contact');
const clientRouter = require('./routers/clients');
const spaceRouter = require('./routers/spaces');
const notificationRouter = require('./routers/notifications');

app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);
app.use('/api/client', clientRouter);
app.use('/api/space', spaceRouter);
app.use('/api/notification', notificationRouter);

//notfound and errors
const errorHandlerMiddleWare = require('./middlewares/errorHandler');
const notFoundMiddleWare = require('./middlewares/notFound');
const { startWebSocketServer } = require('./controllers/webSocket');

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

//ports and start
const PORT = process.env.PORT || 8000;
db.sequelize
  .sync()
  .then((_) => {
    console.log(`database connected`);
    server.listen(PORT, () => {
      console.log(`server is running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

startWebSocketServer(server);
