const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;
    if (!token) {
      reject(new Error('No token provided'));
      return;
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(userData);
    });
  });
};

const requireAdmin = async (req, res, next) => {
  try {
    const userData = await getUserDataFromReq(req);
    if (userData && userData.role === 'admin') {
      req.user = userData;
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch (err) {
    res.status(403).json({ error: 'Admin access required' });
  }
};

module.exports = {
  getUserDataFromReq,
  requireAdmin
}; 