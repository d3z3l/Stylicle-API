const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const subCategoriesSchema = new mongoose.Schema(
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
    categories:{type: mongoose.Schema.Types.ObjectId , ref:"categories"},
    services:[{type: mongoose.Schema.Types.ObjectId , ref:"services"}],
  }
);
const subCategories = mongoose.model('subcategories', subCategoriesSchema);

module.exports = subCategories;
