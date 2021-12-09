const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const likesSchema = new mongoose.Schema(
  {
    
    time: {
      type: Number,
      default: 0,
    },
    Activity_id: {
      type: String,
      default: 0,
    },
    user:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    activity_type: {
      type: String,
      default: '0',
      enum: {
        values: ['0', '1', '2'],
      }
    },
  }
);



const likes = mongoose.model('likes', likesSchema);

module.exports = likes;
