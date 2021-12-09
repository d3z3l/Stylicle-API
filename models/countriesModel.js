const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const countriesSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    code: {
      type: String,
    }
  }
);

const countries = mongoose.model('countries', countriesSchema);

module.exports = countries;
