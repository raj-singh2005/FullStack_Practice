require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const complaintRoutes = require('./routes/complaint.routes');
const userRoutes = require('./routes/user.routes');
const authorityRoutes = require('./routes/authority.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

app.use(express.json());
app.use(cors());

// DB connection
const MONGO_URI = process.env.MONGO_URI ;

const dbConnect = mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Routes and api endpoints

// Now, all complaint URLs will start with /api/complaints
app.use('/api/complaints', complaintRoutes);
// All user URLs will start with /api/users
app.use('/api/users', userRoutes);
// All authority URLs will start with /api/authority
app.use('/api/authority', authorityRoutes);
// All AI-related URLs will start with /api/ai
app.use('/api/ai', aiRoutes);


app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});


// server initialisation
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
