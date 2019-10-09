const express = require('express');
const multer = require('../../middlewares/multer');
const verifyToken = require('../../middlewares/verifyToken');

const router = express.Router();

const userController = require('./users.controller');

// /api/users
router.patch('/', verifyToken, userController.resetAvatar);
router.post('/', verifyToken, multer.upload, userController.addAvatar);
router.put('/', verifyToken, userController.updateUser);
module.exports = router;
