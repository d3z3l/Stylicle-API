const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const ordersSchema = new mongoose.Schema(
  {
    created_date: {
      type: Number,
      default: 0,
    },
    date: {
      type: Number,
      default: 0,
    },
    customer: {
      type: String,
      default: 0,
    },
    seller: {
      type: String,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    qty: {
      type: Number,
      default: 0,
    },
    Payment_method: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: '0',
      enum: {
        values: ['0', '1','2'],
      }
    },
    details:[{type: mongoose.Schema.Types.ObjectId , ref:"order_details"}],
  }
);



const orders = mongoose.model('orders', ordersSchema);

module.exports = orders;

