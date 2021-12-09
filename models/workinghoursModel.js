const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const workinghoursSchema = new mongoose.Schema(
  {
    starting_time: {
      type: Number,
      default: 0,
    },
    end_time: {
      type: Number,
      default: 0,
    },
    off: {
      type: Number,
      default: 0,
    },
    day: {
      type: String,
      enum: {
        values: ['0', '1','2','3','4','5','6','7'],
      }
    },
  }
);



const workinghours = mongoose.model('workinghours', workinghoursSchema);

module.exports = workinghours;

