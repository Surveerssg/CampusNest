require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/trip-haven',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  bcryptSalt: 10,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieMaxAge: 24 * 60 * 60 * 1000 // 24 hours
}; 