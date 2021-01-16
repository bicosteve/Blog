const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const keys = require('../config/keys');

const User = mongoose.model('users');

const auth = async (req, res, next) => {
  try {
    const errors = {};
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = await jwt.verify(token, keys.jwtSecretKey);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      errors.nouser = 'Please provide correct credentials';
      return res.status(400).json(errors);
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    errors.nocred = 'Please authenticate';
    return res.status(402).json(errors);
  }
};

module.exports = auth;
