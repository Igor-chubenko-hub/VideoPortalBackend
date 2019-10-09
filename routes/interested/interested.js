const express = require('express');
const controller = require('./interested.controller');
const { validateInterested } = require('./interested.validator');

const router = express.Router();

// /api/interested
router.post('/', validateInterested, controller.sendMessage);

module.exports = router;
