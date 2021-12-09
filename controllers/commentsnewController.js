const commentsnewModel = require('../models/commentsnewModel');
const newsfeeds_postsModel = require('../models/newsfeeds_postsModel');
const tsModel = require('../models/tsModel');
const jwt = require('jsonwebtoken');

const { token } = require('morgan');
var moment = require('moment');

exports.create = async (req, res) => {
  try {
    var newspostid=req.body.id
    delete req.body.id
    const token = req.header('Authorization');
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const u_id = varified._id;
    var commentsnew = await commentsnewModel.create({
      text:req.body.text,
      user:u_id,
      time:Math.round(moment().valueOf()/1000),
    });
    var _id=commentsnew._id;
     commentsnew = await commentsnewModel.findOne({_id}).populate({path: 'user'});
    var newsfeeds_posts= await newsfeeds_postsModel.findOne({_id:newspostid});
    newsfeeds_posts.commentsDeatils.push(_id)
    newsfeeds_posts.save()
    res.status(200).json({
      status: 'success',
      data: {
        commentsnew
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
exports.create_ts = async (req, res) => {
  try {
    var newspostid=req.body.id
    delete req.body.id
    const token = req.header('Authorization');
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const u_id = varified._id;
    var commentsnew = await commentsnewModel.create({
      text:req.body.text,
      user:u_id,
      time:Math.round(moment().valueOf()/1000),
    });
    var _id=commentsnew._id;
     commentsnew = await commentsnewModel.findOne({_id}).populate({path: 'user'});
    var ts_posts= await tsModel.findOne({_id:newspostid});
    ts_posts.commentsDeatils.push(_id)
    ts_posts.save()
    res.status(200).json({
      status: 'success',
      data: {
        commentsnew
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
exports.get = async (req, res) => {
  try {
    const _id = req.params.id;
    const newsfeeds_posts = await newsfeeds_postsModel.find({_id}).populate([{path:"user"}]);
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
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    const commentsnew = await commentsnewModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        commentsnew
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
    const post_id = req.params.post_id;
    const commentsnew = await commentsnewModel.findOneAndDelete({ _id });
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const newsfeeds_posts = await newsfeeds_postsModel.findOne({ _id:post_id });
    newsfeeds_posts.commentsDeatils.pull(_id);
    newsfeeds_posts.save();
    console.log(newsfeeds_posts);
    res.status(200).json({
      status: 'success',
      data: {
        newsfeeds_posts
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
