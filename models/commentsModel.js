const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');


const CommentSchema = new mongoose.Schema(
  {
    Comment: String,
    text: String,
  }
);



const comments = mongoose.model('comments', CommentSchema);

module.exports = comments;
