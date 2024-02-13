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

const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');
const { deleteMultipleFiles } = require('../utils/fileOps');

const startDiscussion = async (req, res) => {
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
  startDiscussion,
  addReplyToDiscussion,
  editDiscussion,
  deleteDiscussion,
  getAllValidDiscussions,
};
