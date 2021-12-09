const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const newsfeeds_postsSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      // maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    media: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      // maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    time: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    featured:{
      type: String,
      default: '0',
      enum: {
        values: ['0', '1'],
        message: '1=>yes,0=>no'
      },
    },
    user:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    likesDeatils:[{type: mongoose.Schema.Types.ObjectId , ref:"likes"}],
    commentsDeatils:[{type: mongoose.Schema.Types.ObjectId , ref:"commentsnew"}],
  }
);



const newsfeeds_posts = mongoose.model('newsfeeds_posts', newsfeeds_postsSchema);

module.exports = newsfeeds_posts;
