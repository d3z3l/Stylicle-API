const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');


const PostSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    comment:[{type: mongoose.Schema.Types.ObjectId , ref:"comments"}]
  }
);



const posts = mongoose.model('posts', PostSchema);

module.exports = posts;
