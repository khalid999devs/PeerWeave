const { spaces, discussions, clientspaces, resources } = require('../models');
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError,
  CustomAPIError,
} = require('../errors');

const mailer = require('../utils/sendMail');
const deleteFile = require('../utils/deleteFile');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize');

const addResource = async (req, res) => {
  const data = req.body;
  const spaceId = req.params.id;

  if (req.files?.length > 0) {
    const filesArr = [];
    req.files.forEach((file, key) => {
      const filePropName =
        data.Title.split(' ').join('').slice(0, 10) +
        Math.ceil(Math.random() * 100);
      filesArr.push({
        id: filePropName,
        url: file.path,
      });
    });
    data.filesUrl = JSON.stringify(filesArr);
  }
  const resource = await resources.create({ ...data, spaceId: spaceId });
  resource.filesUrl = JSON.parse(resource.filesUrl);
  resource.driveLink = JSON.parse(resource.driveLink);

  res.status(201).json({
    succeed: true,
    msg: 'Successfully added the resource',
    resource,
  });
};

const deleteResource = async (req, res) => {
  const resourceId = req.params.id;
  const resource = await resources.findByPk(resourceId);
  if (!resource) {
    throw new BadRequestError('This particular resource could not found!');
  }
  const files = JSON.parse(resource.filesUrl);
  if (Object.keys(files).length > 0) {
    Object.keys(files).forEach((prop) => {
      deleteFile(files[prop]?.url);
    });
  }
  await resource.destroy();

  res.json({
    succeed: true,
    msg: 'Successfully deleted the resource',
  });
};

module.exports = {
  addResource,
  deleteResource,
};
