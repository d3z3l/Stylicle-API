const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const reactionsSchema = new mongoose.Schema(
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
  }
);



const reactions = mongoose.model('reactions', reactionsSchema);

module.exports = reactions;
