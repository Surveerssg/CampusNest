const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, bcryptSalt } = require('../config/config');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

const register = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { name, email, password, role, propertyName, propertyType, propertyAddress, googleId } = req.body;

    // Google registration
    if (googleId) {
      let user = await User.findOne({ email });
      if (user) {
        // User exists, treat as login
        const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret, {});
        return res.status(200).json({ user, token });
      }
      // Create new Google user
      user = await User.create({
        name,
        email,
        googleId,
        role,
        propertyName,
        propertyType,
        propertyAddress
      });
      const token = jwt.sign({ email: user.email, id: user._id }, jwtSecret, {});
      return res.status(201).json({ user, token });
    }

    // Classic registration
    if (!name || !email || !password) {
      return res.status(422).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(422).json({ error: 'Password must be at least 6 characters long' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ error: 'Email already registered' });
    }
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      propertyName,
      propertyType,
      propertyAddress
    });
    const { password: _, ...userWithoutPassword } = userDoc.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (e) {
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Google login
    if (googleId) {
      if (userDoc.googleId === googleId) {
        const token = jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {});
        return res.status(200).json({ user: userDoc, token });
      } else {
        return res.status(401).json({ error: 'Google authentication failed' });
      }
    }

    // Classic login
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(422).json({ error: 'Password is incorrect' });
    }

    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        const { password, ...userWithoutPassword } = userDoc.toObject();
        res.cookie('token', token).json({
          success: true,
          user: userWithoutPassword,
          token,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.json(null);
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, role } = await User.findById(userData.id);
      res.json({ name, email, _id, role });
    });
  } catch (error) {
    res.status(500).json('Internal server error');
  }
};

const logout = (req, res) => {
  res.cookie('token', '').json(true);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user with that email.' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset link
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    await sendMail({
      to: user.email,
      subject: 'CampusNest Password Reset',
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  forgotPassword
}; 