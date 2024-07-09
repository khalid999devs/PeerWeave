const multer = require('multer');
const { existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const { BadRequestError } = require('../errors');
//file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const validFields = /clients|spaces|resources|discussions/;
    if (!file.fieldname) {
      return cb(null, true);
    }
    const isFieldValid = validFields.test(file.fieldname);
    let nameObjs = {};
    if (!isFieldValid) {
      cb(new Error(`Field name didn't match`));
    }
    let mathRand = Math.ceil(Math.random() * 10).toString();
    let destName = resolve(__dirname, `../uploads/${file.fieldname}`);

    if (file.fieldname === 'resources') {
      destName = resolve(
        __dirname,
        `../uploads/${file.fieldname}/${req.body.Title.split(' ').join('_')}`
      );
    } else if (file.fieldname === 'discussions') {
      nameObjs = JSON.parse(req.body.nameObjFiles);
      const discStr =
        req.user?.userName +
        '_' +
        req.body.text?.slice(0, 6) +
        '@' +
        req.body.time;
      req.body.destRootRange = 5;

      destName = resolve(
        __dirname,
        `../uploads/spaces/${req.params.spaceId}/${file.fieldname}/${discStr}${
          nameObjs[file.originalname].dist || 'fd'
        }`
      );
    }

    if (!existsSync(destName)) {
      try {
        mkdirSync(destName, { recursive: true });
      } catch (error) {
        console.log(error);
      }
    }

    let pathName = `uploads/${file.fieldname}`;

    if (file.fieldname === 'resources') {
      pathName = `uploads/${file.fieldname}/${req.body.Title.split(' ').join(
        '_'
      )}`;
    } else if (file.fieldname === 'discussions') {
      const discStr =
        req.user?.userName +
        '_' +
        req.body.text?.slice(0, 6) +
        '@' +
        req.body.time;

      pathName = `uploads/spaces/${req.params.spaceId}/${
        file.fieldname
      }/${discStr}${nameObjs[file.originalname].dist || 'fd'}`;
    }
    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    let type = file.originalname.split('.');
    let fileExt = type[type.length - 1];

    let fileName = '';
    if (file.fieldname === 'clients') {
      let { fullName, name } = req.body;

      if (fullName) {
        fullName = fullName.trim();
        fileName = fullName.split(' ')[0].toLowerCase() + `@${Date.now()}`;
        req.userName = fileName;
      } else if (name) {
        fileName = name;
      } else {
        cb(new BadRequestError('fullName should be provided'));
      }
    } else if (file.fieldname === 'spaces') {
      fileName =
        req.body.title.split(' ').join('').slice(0, 6) + `@${Date.now()}`;
    } else if (file.fieldname === 'resources') {
      fileName = req.body.Title.split(' ').join('_') + `_${Date.now()}`;
    } else if (file.fieldname === 'discussions') {
      fileName = type.slice(0, -1).join('.');
    } else {
      fileName = file.fieldname + `-${Date.now()}`;
    }
    cb(null, fileName + '.' + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // const fileTypes = /jpeg|jpg|png|pdf|ppt|pptx|txt|doc|docs/;

    // const mimeType = fileTypes.test(file.mimetype);

    // if (mimeType) {
    //   return cb(null, true);
    // } else {
    //   cb(new Error('only jpg,png,jpeg,pdf,ppt,pptxis allowed!'));
    // }
    return cb(null, true);

    cb(new Error('there was an unknown error'));
  },
});

module.exports = upload;
