const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const comments_newSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    time: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    user:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    likesDeatils:[{type: mongoose.Schema.Types.ObjectId , ref:"likes"}],
    repliesDeatils:[{type: mongoose.Schema.Types.ObjectId , ref:"replies"}],
  }
);
const comments_new = mongoose.model('commentsnew', comments_newSchema);
module.exports = comments_new;
