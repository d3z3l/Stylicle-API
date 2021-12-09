const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const assignservicesSchema = new mongoose.Schema(
  {
    
    price: {
      type: Number,
      default: 0,
    },
    seats: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    rest: {
      type: Number,
      default: 0,
    },
    disc: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: '0',
      enum: {
        values: ['0', '1', '2'],
      }
    },
    user:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    services:{type: mongoose.Schema.Types.ObjectId , ref:"services"},
    service_time_slot:[{type: mongoose.Schema.Types.ObjectId , ref:"service_time_slots"}],
  }
);



const assignservices = mongoose.model('assignservices', assignservicesSchema);

module.exports = assignservices;
