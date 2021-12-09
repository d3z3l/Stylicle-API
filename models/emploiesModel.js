const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const emploiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    designaton: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    salary: {
      type: Number,
      default: 0,
    },
    cnic: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    

  }
);



const emploies = mongoose.model('emploies', emploiesSchema);

module.exports = emploies;

