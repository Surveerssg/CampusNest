require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/trip-haven',
  jwtSecret: process.env.JWT_SECRET || '04cbf03ccaa2d4357c7a2eb4816fa36b3b210cbf02b0c0909cb6866ed48fbe93c3df6959679f01c2173b38a1f675a7ae02132a29dc56a41c97083c6b5daf6cc2',
  bcryptSalt: 10,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieMaxAge: 24 * 60 * 60 * 1000 // 24 hours
}; 