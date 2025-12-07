const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const path = require('path');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/organization', require('./routes/organization'));
app.use('/api/materials', require('./routes/materials'));

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'LMS System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      transactions: '/api/transactions',
      certificates: '/api/certificates'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});