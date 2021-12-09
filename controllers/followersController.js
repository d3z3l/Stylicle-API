const usersModel = require('../models/usersModel');
const followersModel = require('../models/followersModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(req)
    // req.body.follower=varified._id;
    const followers = await followersModel.create({
      created_date:12323,
      follower:varified._id,
      followee:req.body.followee
    });
    var user = await usersModel.findOne({ _id: req.body.followee }, (err, user) => {
      user.followers.push(followers._id);
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
    res.status(500).send(errors);
  }
};
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    const followers = await followersModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        followers
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
  const token = req.header('Authorization');

  try {

    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    console.log(_id);
    const followers = await followersModel.deleteMany({follower :_id, followee : req.body.followee});

    // const token = req.header('Authorization');
    // const _id = req.params.id;
    // const followers = await followersModel.findOneAndDelete({ _id });
    // const varified = jwt.verify(token, process.env.TOKEN_SECRET);

    const users = await usersModel.findOne({ _id:varified._id });
    users.followers.pull(_id);
    users.save();
    // console.log(users);
    res.status(200).json({
      status: 'success',
      data: {
        followers
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
    res.status(500).send(`Something went wrong ${error}`);
  }
};
exports.get_followers = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    console.log(_id);
    const followers = await followersModel.find({ followee:_id }).select('follower').populate('follower',['image','name','address','email'])
    res.status(200).json({
      status: 'success',
      data: {
        followers
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
exports.get_followees = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    const followers = await followersModel.find({ follower:_id }).select('followee').populate('followee',['image','name']);
    res.status(200).json({
      status: 'success',
      data: {
        followers
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
exports.followers_varify = async (req, res) => {
  const token = req.header('Authorization');
  try {
    
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    console.log(_id);
    const followers = await followersModel.find({follower :_id, followee : req.body.followee});


    let respons=false
    if(followers.length > 0){
      respons=true
    }
    res.status(200).json({
      status: 'success',
      data:respons
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};
