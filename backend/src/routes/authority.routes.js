const express = require('express');
const router = express.Router();

const { 
    registerAuthority, 
    loginAuthority, 
    getAuthorityProfile 
} = require('../controllers/authority.controller');


// Path: /api/authority/register
router.post('/register', registerAuthority);

// Path: /api/authority/login
router.post('/login', loginAuthority);

// Path: /api/authority/profile/:id
router.get('/profile/:id', getAuthorityProfile);

// 3. Export for server.js
module.exports = router;