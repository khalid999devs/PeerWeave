const router = require('express').Router();

const { addResource, deleteResource } = require('../controllers/spaces');
const {
  startDiscussion,
  addReplyToDiscussion,
  deleteDiscussion,
  getAllValidDiscussions,
} = require('../controllers/discussions');
const clientValidate = require('../middlewares/clientTokenVerify');
const upload = require('../middlewares/uploadFile');

router.get(
  '/get-valid-discussions-client/:id',
  clientValidate,
  getAllValidDiscussions
);

router.post(
  '/add-resource/:id',
  clientValidate,
  upload.array('resources'),
  addResource
);
//discussion part
router.post(
  '/add-discussion-ques-client',
  clientValidate,
  upload.array('discussions'),
  startDiscussion
);
router.post(
  '/add-discussion-reply-client',
  clientValidate,
  upload.array('discussions'),
  addReplyToDiscussion
);

router.delete('/delete-resource/:id', clientValidate, deleteResource);
//discussion
router.delete('/delete-discussion-client', clientValidate, deleteDiscussion);

module.exports = router;
