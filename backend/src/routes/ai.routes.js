const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/ai.controller');

// This matches: POST http://localhost:5000/api/ai/chat
router.post('/chat', chatWithAI);

module.exports = router;