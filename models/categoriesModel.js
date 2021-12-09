const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const categoriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
    },
    status: {
      type: String,
      default: '0',
      enum: {
        values: ['0', '1', '2'],
      }
    },
    subcategories:[{type: mongoose.Schema.Types.ObjectId , ref:"subcategories"}],
  }
);

const categories = mongoose.model('categories', categoriesSchema);

module.exports = categories;
