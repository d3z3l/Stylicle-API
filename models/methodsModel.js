const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const methodsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    code: {
      type: Number
    },
  }
);



const methods = mongoose.model('methods', methodsSchema);

module.exports = methods;

