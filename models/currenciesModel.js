const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const currenciesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [40],
    },
    currency_code: {
      type: String,
      trim: true,
      maxlength: [5],
    },
    symbol: {
      type: String,
      trim: true,
      maxlength: [5],
    },
  }
);



const currencies = mongoose.model('currencies', currenciesSchema);

module.exports = currencies;
