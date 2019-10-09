const express = require('express');
const validator = require('./video.validator');
const verifyToken = require('../../middlewares/verifyToken');
const { upload } = require('./video.helpers');
const controller = require('./video.controller');

const router = express.Router();

// /api/video
router.get('/search', controller.searchVideo);

router.get('/get/:id', controller.getVideo);

router.get('/stream/:name', controller.getVideoStream);

router.delete('/:id', verifyToken, controller.deleteVideo);

router.post(
  '/upload',
  verifyToken,
  validator.validateVideo,
  controller.storeVideoData
);

router.post(
  '/upload/:id',
  verifyToken,
  upload.single('video'),
  controller.uploadFiles
);

router.get('/filter', controller.filterVideo);

router.patch(
  '/upload/:id',
  verifyToken,
  validator.validateStatus,
  controller.setStatus
);

router.get('/categories', controller.getCategories);

router.get('/latest-upload', controller.latestUpload);

router.get('/user-videos', verifyToken, controller.userVideos);

module.exports = router;
