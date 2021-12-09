const usersModel = require('../models/usersModel');
const e_walletsModel = require('../models/e_walletsModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const e_wallets = await e_walletsModel.create(req.body);
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    var user = await usersModel.findOne({ _id: varified._id }, (err, user) => {
      user.e_wallet.push(e_wallets._id);
      user.save();
    });
    user = await usersModel.findOne({ _id: varified._id });
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send('Something went wrong');
  }
};
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    const e_wallets = await e_walletsModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        e_wallets
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send('Something went wrong');
  }
};
