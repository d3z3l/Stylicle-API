const usersModel = require('../models/usersModel');
const tsModel = require('../models/tsModel');
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
    const tsModel_ = await tsModel.create({
      text: req.body.text,
      media: req.body.image_name,
      time: moment().valueOf() / 1000,
      user: varified._id
    });

    var user = await usersModel.findOne({ _id: varified._id }, (err, user) => {
      user.ts.push(tsModel_._id);
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
    const tsModel = await tsModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        tsModel
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
    const tsModel = await tsModel.findOneAndDelete({
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
exports.get_tsModel = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    const tsModel = await tsModel
      .findOne({ user: _id })
      .populate({
        path: 'commentsDeatils'
      });
    res.status(200).json({
      status: 'success',
      data: {
        tsModel
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
exports.get_all_tsModel = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = varified._id;
    const tsModel_ = await tsModel
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
      ]);
    res.status(200).json({
      status: 'success',
      data: {
        tsModel_
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























// exports.create = async (req, res) => {
//   const token = req.header('Authorization');
//   try {
//     console.log(req.body.text);
//     console.log(req.image_name);
//     const varified = jwt.verify(token, process.env.TOKEN_SECRET);
//     const ts = await tsModel.create({
//       text:req.body.text,
//       media:req.image_name,
//       time:moment().valueOf()/1000,
//       user:varified._id
//     });

//     var user = await usersModel.findOne({ _id: '60ba1196387d8d06f344e0a0' }, (err, user) => {
//       user.ts.push(ts._id);
//       user.save();
//     });
//     user = await usersModel.findOne({ _id: varified._id });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         user
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     if (error.name === 'ValidationError') {
//       let errors = {};
//       Object.keys(error.errors).forEach(key => {
//         errors[key] = error.errors[key].message;
//       });
//       return res.status(400).send(errors);
//     }
//     res.status(500).send('Something went wrong');
//   }
// };
// exports.update = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const ts = await tsModel.findOneAndUpdate(
//       { _id },
//       req.body,
//       { new: true , runValidators:true}
//     );
//     res.status(200).json({
//       status: 'success',
//       data: {
//         ts
//       }
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       let errors = {};
//       Object.keys(error.errors).forEach(key => {
//         errors[key] = error.errors[key].message;
//       });
//       return res.status(400).send(errors);
//     }
//     res.status(500).send('Something went wrong');
//   }
// };
// exports.delete = async (req, res) => {
//   try {
//     const token = req.header('Authorization');
//     const _id = req.params.id;
//     const ts = await tsModel.findOneAndDelete({ _id });
//     const varified = jwt.verify(token, process.env.TOKEN_SECRET);
//     const users = await usersModel.findOne({ _id:varified._id });
//     users.newsfeedsPosts.pull(_id);
//     users.save();
//     console.log(users);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         users
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     if (error.name === 'ValidationError') {
//       let errors = {};
//       Object.keys(error.errors).forEach(key => {
//         errors[key] = error.errors[key].message;
//       });
//       return res.status(400).send(errors);
//     }
//     res.status(500).send('Something went wrong ${errors}');
//   }
// };
// exports.get_ts = async (req, res) => {
//   const token = req.header('Authorization');
//   try {
//     const varified = jwt.verify(token, process.env.TOKEN_SECRET);
//     const _id = varified._id;
//     const ts = await tsModel.findOne({ user:_id }).populate(
//       {
//         path : 'commentsDeatils'
//       }
//     );
//     res.status(200).json({
//       status: 'success',
//       data: {
//         ts
//       }
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       let errors = {};
//       Object.keys(error.errors).forEach(key => {
//         errors[key] = error.errors[key].message;
//       });
//       return res.status(400).send(errors);
//     }
//     res.status(500).send('Something went wrong');
//   }
// };
// exports.get_all_ts = async (req, res) => {
//   const token = req.header('Authorization');
//   try {
//     const varified = jwt.verify(token, process.env.TOKEN_SECRET);
//     const _id = varified._id;
//     const ts = await tsModel.find({ user:_id });
//     res.status(200).json({
//       status: 'success',
//       data: {
//         ts
//       }
//     });
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       let errors = {};
//       Object.keys(error.errors).forEach(key => {
//         errors[key] = error.errors[key].message;
//       });
//       return res.status(400).send(errors);
//     }
//     res.status(500).send('Something went wrong');
//   }
// };
