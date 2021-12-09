const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const packagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    price: {
      type: Number
    },
    price_2: {
      type: Number
    },
    features:[{type: mongoose.Schema.Types.ObjectId , ref:"features"}],
  }
);



const packages = mongoose.model('packages', packagesSchema);

module.exports = packages;
