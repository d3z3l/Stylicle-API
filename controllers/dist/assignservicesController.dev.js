"use strict";

var usersModel = require('../models/usersModel');

var assignservicesModel = require('../models/assignservicesModel');

var servicesModel = require('../models/servicesModel');

var jwt = require('jsonwebtoken');

var catchAsync = require('../utils/catchAsync');

var bcrypt = require('bcryptjs');

var _require = require('morgan'),
    token = _require.token;

exports.create = function _callee(req, res) {
  var token, varified, assignservices, user, errors;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.header('Authorization');
          _context.prev = 1;
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          req.body.user = varified._id;
          _context.next = 6;
          return regeneratorRuntime.awrap(assignservicesModel.create(req.body));

        case 6:
          assignservices = _context.sent;
          console.log(varified._id);
          _context.next = 10;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: varified._id
          }, function (err, user) {
            user.assignservices.push(assignservices._id);
            user.save();
          }));

        case 10:
          user = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: varified._id
          }));

        case 13:
          user = _context.sent;
          res.status(200).json({
            status: 'success',
            data: {
              'sd': assignservices
            }
          });
          _context.next = 25;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

          if (!(_context.t0.name === 'ValidationError')) {
            _context.next = 24;
            break;
          }

          errors = {};
          Object.keys(_context.t0.errors).forEach(function (key) {
            errors[key] = _context.t0.errors[key].message;
          });
          return _context.abrupt("return", res.status(400).send(errors));

        case 24:
          res.status(500).send('Something went wrong');

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 17]]);
};

exports["delete"] = function _callee2(req, res) {
  var _id, assignservices, services, errors;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _id = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(assignservicesModel.findOne({
            _id: _id
          }));

        case 4:
          assignservices = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(servicesModel.find({
            _id: {
              $in: assignservices.services
            }
          }));

        case 7:
          services = _context2.sent;
          console.log(services);
          res.status(200).json({
            status: 'success',
            data: {
              services: services
            }
          });
          _context2.next = 19;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);

          if (!(_context2.t0.name === 'ValidationError')) {
            _context2.next = 18;
            break;
          }

          errors = {};
          Object.keys(_context2.t0.errors).forEach(function (key) {
            errors[key] = _context2.t0.errors[key].message;
          });
          return _context2.abrupt("return", res.status(400).send(errors));

        case 18:
          res.status(500).send('Something went wrong');

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.update = function _callee3(req, res) {
  var _id, assignservices, errors;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _id = req.params.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(assignservicesModel.findOneAndUpdate({
            _id: _id
          }, req.body, {
            "new": true,
            runValidators: true
          }));

        case 4:
          assignservices = _context3.sent;
          res.status(200).json({
            status: 'success',
            data: {
              assignservices: assignservices
            }
          });
          _context3.next = 15;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);

          if (!(_context3.t0.name === 'ValidationError')) {
            _context3.next = 14;
            break;
          }

          errors = {};
          Object.keys(_context3.t0.errors).forEach(function (key) {
            errors[key] = _context3.t0.errors[key].message;
          });
          return _context3.abrupt("return", res.status(400).send(errors));

        case 14:
          res.status(500).send('Something went wrong');

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.get = function _callee4(req, res) {
  var _id, assignservices, errors;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log(req.body);
          _id = req.params.id;
          _context4.next = 5;
          return regeneratorRuntime.awrap(assignservicesModel.find({
            _id: _id
          }).populate({
            path: 'service_time_slot'
          }));

        case 5:
          assignservices = _context4.sent;
          res.status(200).json({
            status: 'success',
            data: {
              assignservices: assignservices
            }
          });
          _context4.next = 16;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);

          if (!(_context4.t0.name === 'ValidationError')) {
            _context4.next = 15;
            break;
          }

          errors = {};
          Object.keys(_context4.t0.errors).forEach(function (key) {
            errors[key] = _context4.t0.errors[key].message;
          });
          return _context4.abrupt("return", res.status(400).send(errors));

        case 15:
          res.status(500).send('Something went wrong');

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};