const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tsSchema = new mongoose.Schema(
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
    user:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    likesDeatils:[{type: mongoose.Schema.Types.ObjectId , ref:"likes"}],
    commentsDeatils:[{type: mongoose.Schema.Types.ObjectId , ref:"commentsnew"}],
  }
);


const ts = mongoose.model('ts', tsSchema);

module.exports = ts;
