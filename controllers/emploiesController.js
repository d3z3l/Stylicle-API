const usersModel = require('../models/usersModel');
const emploiesModel = require('../models/emploiesModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const emploies = await emploiesModel.create(req.body);
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(varified._id);
    var user = await usersModel.findOne({ _id: varified._id }, (err, user) => {
      user.emploies.push(emploies._id);
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
    const emploies = await emploiesModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        emploies
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
exports.delete = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const _id = req.params.id;
    const emploies = await emploiesModel.findOneAndDelete({ _id });
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const users = await usersModel.findOne({ _id:varified._id });
    users.emploies.pull(_id);
    users.save();
    console.log(users);
    res.status(200).json({
      status: 'success',
      data: {
        users
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
    res.status(500).send('Something went wrong ${errors}');
  }
};
