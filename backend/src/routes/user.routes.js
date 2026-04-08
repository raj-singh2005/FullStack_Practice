const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    awardStar,
    getUsers // ✨ 1. IMPORT THE NEW FUNCTION
} = require('../controllers/user.controller');

// ✨ 2. ADD THIS ROUTE (Matches: GET http://localhost:5000/api/users)
// This is exactly what the LeaderboardModal is looking for!
router.get('/', getUsers);

// Path: /api/users/signup
router.post('/signup', registerUser);

// Path: /api/users/login
router.post('/login', loginUser);

// Path: /api/users/profile/:id
router.get('/profile/:id', getUserProfile);

// Authority uses this to reward citizens for helpful reports
router.patch('/:id/award-star', awardStar);

module.exports = router;