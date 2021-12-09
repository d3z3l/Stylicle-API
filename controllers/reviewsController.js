const usersModel = require('../models/usersModel');
const reviewsModel = require('../models/reviewsModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const reviews = await reviewsModel.create(req.body);
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    var user = await usersModel.findOne({ _id: req.body.seller }, (err, user) => {
      user.reviews.push(reviews._id);
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
    const reviews = await reviewsModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        reviews
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
exports.get = async (req, res) => {
  try {
    const _id = res.body.seller;
    const reviews = await reviewsModel.find({ _id });
    res.status(200).json({
      status: 'success',
      data: {
        reviews
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
