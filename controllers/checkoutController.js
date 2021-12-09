const usersModel = require('../models/usersModel');
const workinghoursModel = require('../models/workinghoursModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
const cors = require("cors");
// const express = require("express");
const stripe = require("stripe")("sk_test_51JSGJ2F80ufckkOhzzDwhcA0BJ5FhmMKGwVb8k2S2mrKXvSAdKlEOGZXtnCZoZ4XpX0FgM0O5eyt74hk2DVY6LM400rnRRA0vI");
const uuid = require("uuid");

exports.create = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount*100, 
      currency: "usd",
    });
    // const customer = await stripe.customers.create({
    //   email: token.email,
    //   source: token.id
    // });
    // console.log(source)
    // const idempotency_key = uuid();
    // const charge = await stripe.charges.create(
    //   {
    //     amount: product.price * 100,
    //     currency: "usd",
    //     customer: customer.id,
    //     receipt_email: token.email,
    //     description: `Purchased the ${product.name}`,
    //   },
    //   {
    //     idempotency_key
    //   }
    // );
    res.status(200).json({
      status: true,
      
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send(error);
  }
};

