const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const accountsSchema = new mongoose.Schema(
  { 
    total_income: {
      type: Number,
      default: 0,
    },
    Total_outgoing: {
      type: Number,
      default: 0,
    },
    date: {
      type: Number,
      default: 0,
    },
    
  }
);



const accounts = mongoose.model('accounts', accountsSchema);

module.exports = accounts;
