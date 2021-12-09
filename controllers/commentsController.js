const comment = require('../models/commentsModel');
const catchAsync = require('../utils/catchAsync');

exports.getcomments = async (req, res) => {
  const comment = await comment.find({});
  // Tour.findOne({ _id: req.params.id })

  if (!comment) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
};
exports.createcomments = async (req, res) => {
  try {
    const newcomment = await comment.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        newcomment
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

