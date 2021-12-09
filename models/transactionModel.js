const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const transactionSchema = new mongoose.Schema(
  { 
    amount:{
      type: Number,
      default: 0,
    },
    date:{
      type: Number,
      default: 0,
    },
    sender:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    receiver:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    method:{type: String},
  }
);
const transaction = mongoose.model('transaction', transactionSchema);

module.exports = transaction;
