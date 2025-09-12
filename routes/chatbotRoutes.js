const express = require('express');
const { chatbotReply } = require('../app/controllers/chatbotController');
const router = express.Router();

router.post('/chat', chatbotReply);

module.exports = router;
