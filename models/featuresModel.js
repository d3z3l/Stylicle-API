const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const featuresSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      trim: true,
    },
    code: {
      type: Number,
      require: true
    }

  }
);
const features = mongoose.model('features', featuresSchema);
module.exports = features;
