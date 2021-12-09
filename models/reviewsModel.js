const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const reviewsSchema = new mongoose.Schema(
  {
    
    review: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    clint_name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters']
    },
    orders:{type: mongoose.Schema.Types.ObjectId , ref:"orders"},
  }
);



const reviews = mongoose.model('reviews', reviewsSchema);

module.exports = reviews;
