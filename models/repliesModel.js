const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const repliesSchema = new mongoose.Schema(
  {
    
    text: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    time: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likesDeatils:[{type: mongoose.Schema.Types.ObjectId , ref:"likes"}],
  }
);



const replies = mongoose.model('replies', repliesSchema);

module.exports = replies;
