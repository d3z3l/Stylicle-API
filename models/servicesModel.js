const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const servicesSchema = new mongoose.Schema(
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
    image: {
      type: String,
      default: 'service.jpeg',
    },
    popular: {
      type: String,
      default: '0',
      enum: {
        values: ['0', '1'],
      }
    },

    subcategories:{type: mongoose.Schema.Types.ObjectId , ref:"subcategories"},

  }
);
const services = mongoose.model('services', servicesSchema);

module.exports = services;
