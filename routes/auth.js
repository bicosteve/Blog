const express = require('express');
const mongoose = require('mongoose');

const validateRegister = require('../validation/register');

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

module.exports = route;
