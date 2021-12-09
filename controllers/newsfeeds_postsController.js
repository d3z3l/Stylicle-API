const usersModel = require('../models/usersModel');
const newsfeeds_postsModel = require('../models/newsfeeds_postsModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
var moment = require('moment');

exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    console.log(req.body);
    console.log(req.body.text);
    console.log(req.body.image_name);
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const newsfeeds_posts = await newsfeeds_postsModel.create({
      text: req.body.text,
      media: req.body.image_name,
      time: moment().valueOf() / 1000,
      user: varified._id
    });

    var user = await usersModel.findOne({ _id: varified._id }, (err, user) => {
      user.newsfeedsPosts.push(newsfeeds_posts._id);
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
    const newsfeeds_posts = await newsfeeds_postsModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        newsfeeds_posts
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
    const newsfeeds_posts = await newsfeeds_postsModel.findOneAndDelete({
      _id
    });
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const users = await usersModel.findOne({ _id: varified._id });
    users.newsfeedsPosts.pull(_id);
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
exports.get_newsfeeds_posts = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    const newsfeeds_posts = await newsfeeds_postsModel
      .findOne({ user: _id })
      .populate({
        path: 'commentsDeatils'
      });
    res.status(200).json({
      status: 'success',
      data: {
        newsfeeds_posts
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
exports.get_all_newsfeeds_posts = async (req, res) => {
  const token = req.header('Authorization');
  try {
    console.log(req.body);
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    const newsfeeds_posts = await newsfeeds_postsModel
      .find()
      .sort({'_id': -1})
      .populate([
        { path: 'user' },
        {
          path: 'likesDeatils',
          populate: {
            path: 'user'
          },
          options: {
            limit: 3,
            sort: { time: -1 }
          }
        },
        {
          path: 'commentsDeatils',
          populate: {
            path: 'user'
          },
          options: {
            limit: 5,
            sort: { time: -1 }
          }
        }
      ]).limit(4).skip(parseInt(req.body.page *4))
    res.status(200).json({
      status: 'success',
      data: {
        newsfeeds_posts
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
exports.get_all_featured_newsfeeds_posts = async (req, res) => {
  const token = req.header('Authorization');
  try {
    var query = {};
    if (res.limit) {
      query["customer"] = res.limit
    }
      query["featured"] = '1'
    
    
    const newsfeeds_posts = await newsfeeds_postsModel.find(query).sort({'_id': -1}).populate([
      { path: 'user' , select: 'name'}]);
    res.status(200).json({
      status: 'success',
      data: {
        newsfeeds_posts
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
