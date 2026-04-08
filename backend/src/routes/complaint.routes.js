const express = require('express');
const router = express.Router();
const upload = require('../config/cloud.config');

const { 
    createComplaint, 
    getComplaints, 
    getComplaintById, 
    updateComplaintStatus,
    resolveComplaint // ✨ Import the new function
} = require('../controllers/complaint.controller');

// --- Citizen/Guest Routes ---

// GET all reports & POST new report (with 'Before' image)
router.get('/', getComplaints);
router.post('/', upload.single('image'), createComplaint);

// GET specific report details
router.get('/:id', getComplaintById);


// --- Authority Specific Routes ---

// 1. Simple Status Update (e.g., 'In Progress')
router.patch('/:id/status', updateComplaintStatus);

// 2. Full Resolution Update (with 'After' image)
// This handles: PATCH /api/complaints/:id/resolve
router.patch('/:id/resolve', upload.single('image'), resolveComplaint);


module.exports = router;