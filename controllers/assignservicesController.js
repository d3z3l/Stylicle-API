const usersModel = require('../models/usersModel');
const assignservicesModel = require('../models/assignservicesModel');
const servicesModel = require('../models/servicesModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.body.user=varified._id
    const assignservices = await assignservicesModel.create(req.body);
    var user = await usersModel.findOne({ _id: varified._id }, (err, user) => {
      user.assignservices.push(assignservices._id);
      user.save();
    });
    user = await usersModel.findOne({ _id: varified._id });
    res.status(200).json({
      status: 'success',
      data: {
        'sd':assignservices
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
exports.delete = async (req, res) => {
  try {
    
    const token = req.header('Authorization');
    const _id = req.params.id;
    const assignservices = await assignservicesModel.findOneAndDelete({ _id });
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const users = await usersModel.findOne({ _id:varified._id });
    users.assignservices.pull(_id);
    users.save();


    console.log(services);
    res.status(200).json({
      status: 'success',
      data: {
        assignservices
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
    res.status(500).send(error);
  }
};
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    const assignservices = await assignservicesModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        assignservices
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
    console.log(req.body);
    const _id = req.params.id;
    const assignservices = await assignservicesModel.find({ _id}).populate({
      path:'service_time_slot'
    });
    res.status(200).json({
      status: 'success',
      data: {
        assignservices
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
