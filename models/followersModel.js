const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const followersSchema = new mongoose.Schema(
  {
    created_date: {type: Number,default: 0},
    followee:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    follower:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
  }
);
const followers = mongoose.model('followers', followersSchema);
module.exports = followers;
