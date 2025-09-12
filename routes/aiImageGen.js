const express = require('express');
const { generateImage } = require('../app/controllers/AiImageGenerator');
const router = express.Router();

router.post('/generate-image', generateImage);

module.exports = router;
