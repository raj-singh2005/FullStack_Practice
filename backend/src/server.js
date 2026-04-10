require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Import the new Event routes
const complaintRoutes = require('./routes/complaint.routes');
const userRoutes = require('./routes/user.routes');
const authorityRoutes = require('./routes/authority.routes');
const aiRoutes = require('./routes/ai.routes');
const eventRoutes = require('./routes/event.routes'); // 👈 Add this

const app = express();

app.use(express.json());
app.use(cors());

// DB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas - Jamshedpur Civic Connect');
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error);
  });

// --- Routes and API Endpoints ---

// Complaint Logic
app.use('/api/complaints', complaintRoutes);

// User Authentication & Leaderboard
app.use('/api/users', userRoutes);

// Authority Management
app.use('/api/authority', authorityRoutes);

// AI Assistant (Gemini 2.5-Flash-Lite)
app.use('/api/ai', aiRoutes);

// 2. Register the Events System
app.use('/api/events', eventRoutes); // 👈 Add this

app.get('/api', (req, res) => {
  res.json({ message: 'SteelCity-Pulse API is active!' });
});

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});