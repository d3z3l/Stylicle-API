const usersModel = require('../models/usersModel');
const countriesModel = require('../models/countriesModel');
const jwt = require('jsonwebtoken');
const axios = require('axios').default;
const CircularJSON = require('circular-json');

const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');

exports.get = async (req, res) => {
  try {
    
    countries = await countriesModel.find();
    var data='ddd'

    await axios.get('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJb7iwgl8BGTkR5gI96_35yi8&key=AIzaSyDgw4m-jKG2UueegLrTdLfJfO4phMxS6wo')
    .then(function (response) {
      // handle success
      var str =CircularJSON.stringify(response)
      console.log(JSON.parse(str).data.result);

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
    res.status(200).json({
      status: 'success',
      data: {
        countries
      }
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
    res.status(500).send('Something went wrong');
  }
};
exports.getlatlngByid = async (req, res) => {
  var data=''
  try {
    console.log(req.params.id);
    
    await axios.get('https://maps.googleapis.com/maps/api/place/details/json?placeid='+req.params.id+'&key=AIzaSyDgw4m-jKG2UueegLrTdLfJfO4phMxS6wo')
    .then(function (response) {
      // handle success
      var str =CircularJSON.stringify(response)
      data=JSON.parse(str).data.result.geometry.location
      // console.log(JSON.parse(str).data.result);

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
    res.status(200).json({
      status: 'success',
      data: {
        data
      }
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
    res.status(500).send('Something went wrong');
  }
};

