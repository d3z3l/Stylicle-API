const persons = require('../models/joinModel');
const posts = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');

exports.getUsers = async (req, res) => {

  const user = await persons
    .findOne()
    .populate(
      {
        path : 'post',
        populate : {
          path : 'comment',
          match: { _id: {$eq: '60906935e9803d0628a9e0c5'} }
        }
      }
    )
    .exec((err, user) => {
      if (err) return console.log(err);
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
      return user;
    });
  console.log(user);
  // Tour.findOne({ _id: req.params.id })
  // if (!user) {
  //   return next(new AppError('No tour found with that ID', 404));
  // }
};


exports.createUser = async (req, res) => {
  try {
    const newpost = await posts.create({
      title: 'Post comment',
      body: ' this is the post for comment',
      comment:'60906935e9803d0628a9e0c5'
    });

    await persons.findOne( (err, user) => {
      if (user) {
        // The below two lines will add the newly saved review's
        // ObjectID to the the User's reviews array field
        user.post.push(newpost.id);
        user.save();
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
    res.status(500).send('Something went1 wrong');
  }
  

  const user = await posts.findOne();
 

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
