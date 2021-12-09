const likesModel = require('../models/likesModel');
const commentsnewModel = require('../models/commentsnewModel');
const newsfeeds_postsModel = require('../models/newsfeeds_postsModel');

const tsModel = require('../models/tsModel');
const jwt = require('jsonwebtoken');

const { token } = require('morgan');
var moment = require('moment');

exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    var newspostid=req.body.Activity_id
    req.body.user=varified._id
    const likes = await likesModel.create(req.body);
    var _id=likes._id;
    var data=null
    switch (req.body.activity_type) {
      case '1':
        data= await newsfeeds_postsModel.findOne({_id:newspostid});
        break;
      case '2':
        data= await tsModel.findOne({_id:newspostid});
        break;
      case '3':
        data= await commentsnewModel.findOne({_id:newspostid});
        break;
    }
    var ts= await tsModel.findOne({_id:newspostid});
    console.log(data);
    data.likesDeatils.push(_id)
    data.likes=data.likes+1
    data.save()
    res.status(200).json({
      status:'success',
      data: {
        likes
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
exports.getbyActivity = async (req, res) => {
  try {
    const _id = req.params.id;
    console.log(JSON.stringify(_id));
    const Activity_id = req.params.post_id;
    var data=null
    switch (_id+'') {
      case '1':
        data= await newsfeeds_postsModel.find({_id:Activity_id}).select('likesDeatils');
        break;
      case '2':
        data= await tsModel.find({_id:Activity_id}).select('likesDeatils');
        break;
      case '3':
        data= await commentsnewModel.find({_id:Activity_id}).select('likesDeatils');
        break;
    }
    console.log(data);
    res.status(200).json({
      status: 'success',
      data: {
        data
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
exports.verify = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    const Activity_id = req.body.Activity_id;
    const type = req.body.activity_type;
    var data=null
    switch (type) {
      case '1':
        data= await likesModel.find({Activity_id:Activity_id,user:_id});
        break;
      case '2':
        data= await likesModel.find({Activity_id:Activity_id});
        break;
      case '3':
        data= await likesModel.find({Activity_id:Activity_id});
        break;
    }
    console.log(data);
    res.status(200).json({
      status: 'success',
      data: {
        data
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
    const _id = req.params.id;
    const ts = await tsModel.find({_id});
    res.status(200).json({
      status: 'success',
      data: {
        ts
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
    const likes = await likesModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        likes
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
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    // const _id = req.params.id;
    const post_id = req.params.post_id;
    const type = req.params.type;
    const likes = await likesModel.findOneAndDelete({ user:_id,Activity_id:post_id });
    console.log(likes);
    var data=null
    switch (type+'') {
      case '1':
        data= await newsfeeds_postsModel.findOne({_id:post_id});
         await newsfeeds_postsModel.findOneAndUpdate(
          {_id:post_id},
          {$inc : {'likes' : -1}},
          { new: true , runValidators:true}
        );
        break;
      case '2':
        data= await tsModel.findOne({_id:post_id});
        await tsModel.findOneAndUpdate(
          {_id:post_id},
          {$inc : {'likes' : -1}},
          { new: true , runValidators:true}
        );
        break;
      case '3':
        data= await commentsnewModel.findOne({_id:post_id});
        break;
    }
    // const ts = await tsModel.findOne({ _id:post_id });
    data.likesDeatils.pull(likes._id);
    data.save();
    res.status(200).json({
      status: 'success',
      data: {
        data
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
    res.status(500).send('Something went wrong '+errors);
  }
};
