const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const config = require('./src/config/config');
const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const placeRoutes = require('./src/routes/placeRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(config.mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

