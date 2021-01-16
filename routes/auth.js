const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validateRegister = require('../validation/register');
const validateLogin = require('../validation/login');
const keys = require('../config/keys');

const route = express();

const User = mongoose.model('users');

route.get('/user', (req, res) => {
  return res.status(200).json({ msg: 'Working' });
});

route.post('/register', async (req, res) => {
  try {
    const { errors, isValid } = validateRegister(req.body);
    if (!isValid) return res.status(400).json(errors);

    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.email = 'Email is already registered!';
      return res.status(400).json(errors);
    }

    const user = new User({ ...req.body });
    const result = await user.save();
    if (!result) return res.status(400).json({ msg: 'User not created!' });
    return res.status(201).json({ user, msg: 'User created!' });
  } catch (error) {
    //console.log(error);
    return res.status(500).json(error.message);
  }
});

route.post('/login', async (req, res) => {
  try {
    const { errors, isValid } = validateLogin(req.body);
    if (!isValid) return res.status(400).json(errors);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      errors.email = 'User does not exist';
      return res.status(404).json(errors);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      errors.password = 'Please provide correct credentials';
      return res.status(400).json(errors);
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(payload, keys.jwtSecretKey, {
      expiresIn: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ user, token: `Bearer ${token}` });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = route;
