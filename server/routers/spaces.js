const router = require('express').Router();

const { addResource, deleteResource } = require('../controllers/spaces');
const {
  addDiscussion,
  addDiscussionFiles,
  addReplyToDiscussion,
  deleteDiscussion,
  getAllValidDiscussions,
  getAllDiscussions,
  downloadDiscussionFiles,
} = require('../controllers/discussions');
const clientValidate = require('../middlewares/clientTokenVerify');
const upload = require('../middlewares/uploadFile');

router.post(
  '/get-valid-discussions',
  // clientValidate,
  getAllDiscussions
);

router.post(
  '/add-resource/:id',
  clientValidate,
  upload.array('resources'),
  addResource
);
//discussion part
router.post(
  '/add-discussion-files/:spaceId',
  upload.array('discussions'),
  addDiscussionFiles
);
router.get('/download-discussion-files', downloadDiscussionFiles);
router.post(
  '/add-discussion',
  // clientValidate,
  // upload.array('discussions'),
  addDiscussion
);

router.delete('/delete-resource/:id', clientValidate, deleteResource);
//discussion
router.delete('/delete-discussion-client', clientValidate, deleteDiscussion);

module.exports = router;
