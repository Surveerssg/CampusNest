const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout, forgotPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

module.exports = router; 