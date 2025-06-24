const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.post('/logout', logout);

module.exports = router; 