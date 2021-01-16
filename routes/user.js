const express = require('express');
const mongoose = require('mongoose');

const auth = require('../middleware/auth');
const validateEdit = require('../validation/edit');
const User = mongoose.model('users');

const route = express();

route.get('/users', async (req, res) => {
  try {
    const errors = {};
    const users = await User.find();
    if (!users) {
      errors.nousers = 'No users were found!';
      return res.status(404).json(errors);
    }
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.get('/user/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.put('/user/me', auth, async (req, res) => {
  try {
    const { errors, isValid } = validateEdit(req.body);

    if (!isValid) return res.status(400).json(errors);

    const updates = Object.keys(req.body);
    const allowed = ['username', 'password'];
    const valid = updates.every((update) => {
      return allowed.includes(update);
    });

    if (!valid) {
      errors.forbiden = 'This operation is not allowed!';
      return res.status(400).json(errors);
    }

    const user = await User.findById(req.user._id);

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    user.updated = Date.now();
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.delete('/user/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await user.remove();
    return res.status(200).json({ msg: 'User removed!' });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = route;
