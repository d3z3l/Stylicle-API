const usersModel = require('../models/usersModel');
const workinghoursModel = require('../models/workinghoursModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

exports.create = async (req, res) => {
  // const token = req.header('Authorization');
  try {
    
    // const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log(varified._id);
    for (let i = 1; i < 8; i++) {
      const workinghours = await workinghoursModel.create({ starting_time: 28800, end_time: 64800, off: 0, day: ''+i });
        var user = await usersModel.findOne({ _id: req.body._id }, (err, user) => {
          user.workinghours.push(workinghours._id);
          user.save();
        });
    }
    
    user = await usersModel.findOne({ _id: req.body._id });

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
    const workinghours = await workinghoursModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        workinghours
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
