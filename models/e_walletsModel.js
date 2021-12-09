const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const e_walletsSchema = new mongoose.Schema(
  {
    
    ballence: {
      type: Number,
      default: 0,
    },
    due_ballence: {
      type: Number,
      default: 0,
    },
    date: {
      type: Number,
      default: 0,
    },
    transactions:[{type: mongoose.Schema.Types.ObjectId , ref:"transactions"}],
  }
);



const e_wallets = mongoose.model('e_wallets', e_walletsSchema);

module.exports = e_wallets;
