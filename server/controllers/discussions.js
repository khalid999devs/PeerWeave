const {
  spaces,
  notifications,
  discussions,
  clientspaces,
  Admin,
  msgreplies,
} = require('../models');
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError,
  CustomAPIError,
} = require('../errors');
const archiver = require('archiver');

const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');
const { deleteMultipleFiles, addFileToStructure } = require('../utils/fileOps');

const addDiscussionFiles = async (req, res) => {
  let filesUrl = [],
    parentsUrl = [];

  let pathR;
  let destR;
  const spaceId = req.params.spaceId;
  const { text, type, time, replyTo, owner, mentions } = req.body;
  const user = req.user;

  if (req.files?.length > 0) {
    parentsUrl = JSON.parse(req.body.parentFiles);
    const nameObjs = JSON.parse(req.body.nameObjFiles);
    let splited = req.files[0].path
      .split('\\')
      .slice(0, req.body.destRootRange);

    pathR = splited.join('\\');
    destR = splited.join('/');

    filesUrl = req.files.map((file) => {
      parentsUrl.forEach((item) => {
        if (item.type === 'file' && item.name === file.originalname) {
          item.path = file.path;
          item.size = file.size;
          item.dest = file.destination + '/' + file.originalname;
        }
      });

      return {
        originalname: file.originalname,
        path: file.path,
        destination: file.destination,
        size: file.size,
        type: nameObjs[file.originalname].type,
        dist: nameObjs[file.originalname].dist,
      };
    });
    parentsUrl.forEach((item) => {
      if (item.type === 'folder') {
        item.path = pathR + '\\' + item.name;
        item.dest = destR + '/' + item.name;
      }
    });
  }

  const data = {
    text,
    type,
    time,
    replyTo: replyTo,
    owner: user || owner,
    mentions: mentions,
    filesUrl: JSON.stringify(filesUrl),
    parentsUrl: JSON.stringify(parentsUrl),
    spaceId,
  };
  const result = await discussions.create(data);

  res.json({
    result: { ...result.dataValues },
    succeed: true,
    msg: 'Successfully uploaded files or folders',
  });
};

const getAllDiscussions = async (req, res) => {
  const { skip, rowNum, spaceId } = req.body;
  const result = await discussions.findAll({
    offset: Number(skip),
    limit: Number(rowNum),
    order: [['id', 'DESC']],
    where: { spaceId },
  });
  const data = result.map((item) => {
    return { ...item.dataValues };
  });

  res.json({
    result: data,
    succeed: true,
    msg: 'successfully got discussions',
  });
};

const downloadDiscussionFiles = async (req, res) => {
  const type = req.query.type; // 'file' or 'folder'
  const name = req.query.name; // Name of the file or folder
  const destName = req.query.destName;

  if (type === 'file') {
    // Serve the single file directly
    const filePath = destName;
    res.download(filePath);
  } else if (type === 'folder') {
    // Dynamically create a ZIP of the requested folder
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${name}.zip"`,
    });

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => res.status(500).send({ error: err.message }));
    archive.pipe(res);

    // Adjust the directory path as needed
    const folderPath = destName;
    archive.directory(folderPath, false);
    archive.finalize();
  } else {
    res.status(400).send('Invalid request');
  }
};

const addDiscussion = async (req, res) => {
  let { question, spaceId } = req.body;
  spaceId = Number(spaceId);
  const user = req.user
    ? JSON.stringify(req.user)
    : req.admin
    ? JSON.stringify(req.admin)
    : undefined;
  if (!user) {
    throw new UnauthorizedError('User could not found!');
  }

  if (req.user) {
    const hasClientSpace = await clientspaces.findOne({
      where: { clientId: req.user.id, spaceId: spaceId },
    });
    if (!hasClientSpace) {
      throw new UnauthorizedError(
        'You are not authorized to start discussion here. please Enroll first'
      );
    }
  }

  const space = await spaces.findOne({
    where: { id: Number(spaceId) },
  });
  if (!space) {
    throw new NotFoundError('space not found');
  }

  let filesUrl = [];
  if (req.files?.length > 0) {
    filesUrl = req.files.map((file) => {
      return {
        originalname: file.originalname,
        path: file.path,
        filename: file.filename,
      };
    });
  }

  const allDiscWithRply = await discussions.findAll({
    where: { spaceId: spaceId },
    include: {
      model: msgreplies,
    },
  });

  const newDiscussion = {
    question,
    user: user,
    spaceId,
    filesUrl: JSON.stringify(filesUrl),
  };

  const discussion = await discussions.create(newDiscussion);
  allDiscWithRply.push(discussion);

  const alldisscussions = allDiscWithRply.map((discussion) => {
    return {
      ...discussion.dataValues,
      user: JSON.parse(discussion.dataValues.user),
      filesUrl: JSON.parse(discussion.dataValues.filesUrl),
    };
  });

  //notification update
  if (req.user) {
    await notifications.create({
      clientId: req.user?.id,
      title: 'New question created',
      message: `A new question was created in ${space.name}`,
    });
  }

  res.status(201).json({
    succeed: true,
    msg: 'Successfully created a question in discussion',
    alldisscussions,
  });
};

const addReplyToDiscussion = async (req, res) => {
  let { reply, spaceId, discussionId } = req.body;
  spaceId = Number(spaceId);
  const user = req.user
    ? JSON.stringify(req.user)
    : req.admin
    ? JSON.stringify(req.admin)
    : undefined;
  if (!user) {
    throw new UnauthorizedError('User could not found!');
  }

  if (req.user) {
    const hasClientSpace = await clientspaces.findOne({
      where: { clientId: req.user.id },
    });
    if (!hasClientSpace) {
      if (req.files?.length > 0) {
        deleteMultipleFiles(req.files);
      }
      throw new UnauthorizedError(
        'You are not authorized to start discussion here. please Enroll first'
      );
    }
  }

  const space = await spaces.findByPk(spaceId);
  if (!space) {
    throw new NotFoundError('space not found');
  }

  let filesUrl = [];
  if (req.files?.length > 0) {
    filesUrl = req.files.map((file) => {
      return {
        originalname: file.originalname,
        path: file.path,
        filename: file.filename,
      };
    });
  }

  const allRplyWithDisc = await discussions.findOne({
    where: { id: discussionId, spaceId: spaceId },
    include: {
      model: msgreplies,
    },
  });

  if (!allRplyWithDisc) {
    if (req.files?.length > 0) {
      deleteMultipleFiles(req.files);
    }
    throw new NotFoundError(
      'The discussion was not found user this space. Please provide correct info!'
    );
  }

  const newReply = {
    user: user,
    reply,
    filesUrl: JSON.stringify(filesUrl),
    discussionId: Number(discussionId),
  };

  const createdReply = await msgreplies.create(newReply);

  allRplyWithDisc.msgreplies.push(createdReply);

  const result = allRplyWithDisc.dataValues;
  result.msgreplies = result.msgreplies.map((cmtRply) => {
    return {
      ...cmtRply.dataValues,
      user: JSON.parse(cmtRply.dataValues.user),
      filesUrl: JSON.parse(cmtRply.dataValues.filesUrl),
    };
  });

  result.user = JSON.parse(result.user);
  result.filesUrl = JSON.parse(result.filesUrl);

  await notifications.create({
    clientId: req.user?.id,
    title: 'New Question Reply added',
    message: `You have a new question reply in ${space?.name}`,
  });

  res.status(201).json({
    succeed: true,
    msg: 'Message reply added successfully',
    discussion: result,
  });
};

const editDiscussion = async (req, res) => {
  console.log('Discussion edited');
  res.json({
    succeed: true,
    msg: 'Discussion edited. Future upgrade feature!',
  });
};

const deleteDiscussion = async (req, res) => {
  console.log('Discussion deleted');
  res.json({
    succeed: true,
    msg: 'Discussion deleted. Future upgrade feature!',
  });
};

//for valid space users
const getAllValidDiscussions = async (req, res) => {
  const spaceId = req.params.id;
  const user = req.user || req.admin;

  if (user.role !== 'admin') {
    const hasClientSpace = await clientspaces.findOne({
      where: { spaceId, clientId: user.id },
    });
    if (!hasClientSpace) {
      throw new UnauthorizedError(
        'You are not authorized to access the discussions!'
      );
    }
  }

  const allDiscWithRply = await discussions.findAll({
    where: { spaceId },
    include: { model: msgreplies },
  });

  // result.user = JSON.parse(result.user);
  // result.filesUrl = JSON.parse(result.filesUrl);

  res.json({
    succeed: true,
    msg: 'Successfully got discussions.',
    result: allDiscWithRply,
  });
};

module.exports = {
  addDiscussionFiles,
  addDiscussion,
  addReplyToDiscussion,
  editDiscussion,
  deleteDiscussion,
  getAllValidDiscussions,
  getAllDiscussions,
  downloadDiscussionFiles,
};
