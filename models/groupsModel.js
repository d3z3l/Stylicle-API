const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const groupsSchema = new mongoose.Schema(
  {
    numbers
    : {
      type: Number,
      default: 0,
    },
    user:[{type: mongoose.Schema.Types.ObjectId , ref:"users"}],
  }
);


const groups = mongoose.model('groups', groupsSchema);

module.exports = groups;
