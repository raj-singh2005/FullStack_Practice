const express = require('express');
const router = express.Router();
const { 
    createEvent, 
    getEvents, 
    joinEvent, 
    fundEvent 
} = require('../controllers/event.controller');

// Matches: /api/events
router.get('/', getEvents);
router.post('/create', createEvent);
router.post('/join', joinEvent);
router.post('/fund', fundEvent);

module.exports = router;