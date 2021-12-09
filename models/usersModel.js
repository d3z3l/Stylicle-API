const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already used'],
      trim: true,
      validate:{
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false
      }
    },
    phone: {
      type: String,
      trim: true,
      required: [true, 'Phone is required'],
    },
    p_phone: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: 'avatar.png',
    },
    subscription: {
      type: Number,
      default: 0,
      message: '2=>Per order,1=>mounthly,3=>trial'
    },
    subscription_date: {
      type: Number,
      default: 0,
    },
    business: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    p_address: {
      type: String,
      default: '',
    },
    banner_image: {
      type: String,
      default: 'logo2.png',
    },
    consultation_price: {
      type: Number,
      default: 0,
    },
    geo_location: {
      type: String,
      default: '{"lat": 1,"lng": 1}',
    },
    status: {
      type: String,
      default: '1',
      enum: {
        values: ['0', '1', '2','3','4'],
        message: '0=>offline,1=>online,2=>disable,3=>expire account,4=>Due payment Expiry'
      }

    },
    role_id: {
      type: String,
      default: '0',
      enum: {
        values: ['0', '1', '2'],
        message: '2=>admin,1=>seller,0=>user'
      },
      required: true
    },
    password: {
      type: String,
      required: [true, 'Enter any password']
    },
    disc: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: 'Male',
      enum: {
        values: ['Male','Female'],
      },
    },
    personal_title: {
      type: String,
      default: 'Mr',
      enum: {
        values: ['Mr','Mrs','Miss','Ms'],
      },
    },
    job_title: {
      type: String,
      default: 'Owner',
    },
    consultation_price: {
      type: Number,
      default: 0,
    },
    lat: {
      type: Number,
      default: 1,
    },
    lng: {
      type: Number,
      default: 1,
    },
    package:[{type: mongoose.Schema.Types.ObjectId , ref:"packages"}],
    workinghours:[{type: mongoose.Schema.Types.ObjectId , ref:"workinghours"}],
    assignservices:[{type: mongoose.Schema.Types.ObjectId , ref:"assignservices"}],
    reviews:[{type: mongoose.Schema.Types.ObjectId , ref:"reviews"}],
    orders:[{type: mongoose.Schema.Types.ObjectId , ref:"orders"}],
    e_wallet:[{type: mongoose.Schema.Types.ObjectId , ref:"e_wallets"}],
    emploies:[{type: mongoose.Schema.Types.ObjectId , ref:"emploies"}],
    chat:[{type: mongoose.Schema.Types.ObjectId , ref:"chat"}],
    account:[{type: mongoose.Schema.Types.ObjectId , ref:"accounts"}],
    newsfeedsPosts:[{type: mongoose.Schema.Types.ObjectId , ref:"newsfeeds_posts"}],
    ts:[{type: mongoose.Schema.Types.ObjectId , ref:"ts"}],
    followers:[{type: mongoose.Schema.Types.ObjectId , ref:"followers"}],
  }
);



const users = mongoose.model('users', usersSchema);

module.exports = users;
