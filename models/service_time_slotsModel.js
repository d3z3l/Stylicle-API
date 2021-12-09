const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const service_time_slotsSchema = new mongoose.Schema(
  {
    created_date: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: '0',
      enum: {
        values: ['0', '1'],
      }
    },
    day: {
      type: String,
      default: '',
    },
    start_time:{
      type: Number,
      default: 0,
    },
    end_time:{
      type: Number,
      default: 0,
    },
    assignservices:{type: mongoose.Schema.Types.ObjectId , ref:"assignservices"},
    orders:[{type: mongoose.Schema.Types.ObjectId , ref:"orders"}]
  }
);



const service_time_slots = mongoose.model('service_time_slots', service_time_slotsSchema);

module.exports = service_time_slots;
