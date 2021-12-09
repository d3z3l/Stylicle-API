const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const order_detailsSchema = new mongoose.Schema(
  { 
    date:{type: Number},
    seller:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    customer:{type: mongoose.Schema.Types.ObjectId , ref:"users"},
    services_val:{type: String},
    time_slot_val:{type: String},
    services:{type: mongoose.Schema.Types.ObjectId , ref:"services"},
    time_slot:{type: mongoose.Schema.Types.ObjectId , ref:"service_time_slots"},
    assignservices:{type: mongoose.Schema.Types.ObjectId , ref:"assignservices"},
    status:{type: Number},
  }
);

const order_details = mongoose.model('order_details', order_detailsSchema);

module.exports = order_details;

