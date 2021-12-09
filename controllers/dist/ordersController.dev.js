"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var ordersModel = require('../models/ordersModel');

var service_time_slotsModel = require('../models/service_time_slotsModel');

var order_detailsModel = require('../models/order_detailsModel');

var jwt = require('jsonwebtoken');

var moment = require('moment');

exports.create = function _callee(req, res) {
  var token, varified, orders, details, errors;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.header('Authorization');
          _context.prev = 1;
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          _context.next = 5;
          return regeneratorRuntime.awrap(ordersModel.create(req.body));

        case 5:
          orders = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(order_detailsModel.updateMany({
            _id: req.body.details
          }, {
            "$set": {
              status: 1
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 8:
          details = _context.sent;
          // const orders2 = await order_detailsModel.find({ _id:"60d5ac76cd77bb0b33776d1f" });
          res.status(200).json({
            status: 'success',
            data: {
              details: details
            }
          });
          _context.next = 20;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

          if (!(_context.t0.name === 'ValidationError')) {
            _context.next = 19;
            break;
          }

          errors = {};
          Object.keys(_context.t0.errors).forEach(function (key) {
            errors[key] = _context.t0.errors[key].message;
          });
          return _context.abrupt("return", res.status(400).send(errors));

        case 19:
          res.status(500).send('Something went wrong');

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

exports.create_old = function _callee2(req, res) {
  var token, varified, orders, id_array, index, details, service_time_slots, errors;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = req.header('Authorization');
          _context2.prev = 1;
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          _context2.next = 5;
          return regeneratorRuntime.awrap(ordersModel.create({
            "seller": req.body.seller,
            "customer": varified._id,
            "price": req.body.price,
            "qty": req.body.qty,
            "Payment_method": req.body.Payment_method,
            "date": req.body.date
          }));

        case 5:
          orders = _context2.sent;
          id_array = [];
          index = 0;

        case 8:
          if (!(index < req.body.slots.length)) {
            _context2.next = 21;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(order_detailsModel.create({
            'services': req.body.service[index],
            'time_slot': req.body.slots[index],
            'date': req.body.date,
            'seller': req.body.seller,
            'customer': varified._id,
            'services_val': req.body.service[index],
            'time_slot_val': req.body.slots[index]
          }));

        case 11:
          details = _context2.sent;
          id_array = [].concat(_toConsumableArray(id_array), [details._id]);
          _context2.next = 15;
          return regeneratorRuntime.awrap(service_time_slotsModel.findOne({
            _id: req.body.slots[index]
          }));

        case 15:
          service_time_slots = _context2.sent;
          service_time_slots.orders.push(orders._id);
          service_time_slots.save();

        case 18:
          index++;
          _context2.next = 8;
          break;

        case 21:
          orders.details.push({
            $each: id_array,
            $position: 0
          });
          orders.save();
          res.status(200).json({
            status: 'success',
            data: {
              orders: orders
            }
          });
          _context2.next = 34;
          break;

        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);

          if (!(_context2.t0.name === 'ValidationError')) {
            _context2.next = 33;
            break;
          }

          errors = {};
          Object.keys(_context2.t0.errors).forEach(function (key) {
            errors[key] = _context2.t0.errors[key].message;
          });
          return _context2.abrupt("return", res.status(400).send(errors));

        case 33:
          res.status(500).send('Something went wrong');

        case 34:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 26]]);
};

exports.create_reservation = function _callee3(req, res) {
  var token, varified, details, errors;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = req.header('Authorization');
          _context3.prev = 1;
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          _context3.next = 5;
          return regeneratorRuntime.awrap(order_detailsModel.create({
            'services': req.body.service,
            'time_slot': req.body.slots,
            'date': req.body.date,
            'seller': req.body.seller,
            'customer': varified._id,
            'services_val': req.body.service,
            'time_slot_val': req.body.slots,
            status: 0
          }));

        case 5:
          details = _context3.sent;
          res.status(200).json({
            status: 'success',
            data: {
              details: details
            }
          });
          _context3.next = 17;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](1);
          console.log(_context3.t0);

          if (!(_context3.t0.name === 'ValidationError')) {
            _context3.next = 16;
            break;
          }

          errors = {};
          Object.keys(_context3.t0.errors).forEach(function (key) {
            errors[key] = _context3.t0.errors[key].message;
          });
          return _context3.abrupt("return", res.status(400).send(errors));

        case 16:
          res.status(500).send('Something went wrong');

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.update = function _callee4(req, res) {
  var _id, orders, errors;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ordersModel.findOneAndUpdate({
            _id: _id
          }, req.body, {
            "new": true,
            runValidators: true
          }));

        case 4:
          orders = _context4.sent;
          res.status(200).json({
            status: 'success',
            data: {
              orders: orders
            }
          });
          _context4.next = 15;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);

          if (!(_context4.t0.name === 'ValidationError')) {
            _context4.next = 14;
            break;
          }

          errors = {};
          Object.keys(_context4.t0.errors).forEach(function (key) {
            errors[key] = _context4.t0.errors[key].message;
          });
          return _context4.abrupt("return", res.status(400).send(errors));

        case 14:
          res.status(500).send('Something went wrong');

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.cancel = function _callee5(req, res) {
  var _id, orders, errors;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _id = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(ordersModel.findOne({
            _id: _id
          }));

        case 4:
          orders = _context5.sent;
          // unid_date=moment(moment().format('l')).valueOf()/1000 
          unix_c_date = moment().valueOf() / 1000;
          zone = moment().zone();
          message = "cant cancel";

          if (orders.date - unix_c_date > 7200) {
            message = "cancel successfully";
            orders.status = '2';
            orders.save();
          } else {
            if (orders.date - unix_c_date > 300) {
              message = "cancel successfully";
              orders.status = '2';
              orders.save();
            } else {}
          }

          res.status(200).json({
            status: 'success',
            data: {
              message: message
            }
          });
          _context5.next = 19;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);

          if (!(_context5.t0.name === 'ValidationError')) {
            _context5.next = 18;
            break;
          }

          errors = {};
          Object.keys(_context5.t0.errors).forEach(function (key) {
            errors[key] = _context5.t0.errors[key].message;
          });
          return _context5.abrupt("return", res.status(400).send(errors));

        case 18:
          res.status(500).send('Something went wrong');

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports["delete"] = function _callee6(req, res) {
  var _id, orders, index, errors;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _id = req.params.id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(ordersModel.findOne({
            _id: _id
          }));

        case 4:
          orders = _context6.sent;
          console.log('' + orders.details);
          index = 0;

        case 7:
          if (!(index < orders.details.length)) {
            _context6.next = 14;
            break;
          }

          console.log(orders.details[index]);
          _context6.next = 11;
          return regeneratorRuntime.awrap(order_detailsModel.findOneAndDelete({
            _id: orders.details[index]
          }));

        case 11:
          index++;
          _context6.next = 7;
          break;

        case 14:
          orders.remove();
          res.status(200).json({
            status: 'success',
            data: {
              orders: orders
            }
          });
          _context6.next = 26;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

          if (!(_context6.t0.name === 'ValidationError')) {
            _context6.next = 25;
            break;
          }

          errors = {};
          Object.keys(_context6.t0.errors).forEach(function (key) {
            errors[key] = _context6.t0.errors[key].message;
          });
          return _context6.abrupt("return", res.status(400).send(errors));

        case 25:
          res.status(500).send('Something went wrong');

        case 26:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.get = function _callee7(req, res) {
  var _id, orders, errors;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _id = req.params.id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(ordersModel.findOne({
            _id: _id
          }).populate({
            path: 'details',
            populate: {
              path: 'seller'
            }
          }));

        case 4:
          orders = _context7.sent;
          res.status(200).json({
            status: 'success',
            data: {
              orders: orders
            }
          });
          _context7.next = 15;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);

          if (!(_context7.t0.name === 'ValidationError')) {
            _context7.next = 14;
            break;
          }

          errors = {};
          Object.keys(_context7.t0.errors).forEach(function (key) {
            errors[key] = _context7.t0.errors[key].message;
          });
          return _context7.abrupt("return", res.status(400).send(errors));

        case 14:
          res.status(500).send('Something went wrong');

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.get_allorders = function _callee8(req, res) {
  var query, orders, errors;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          query = {};

          if (req.body.customer) {
            query["customer"] = req.body.customer;
          }

          if (req.body.seller) {
            query["seller"] = req.body.seller;
          }

          if (req.body._id) {
            query["_id"] = req.body._id;
          }

          if (req.body._id) {
            query["status"] = req.body.status;
          }

          _context8.next = 8;
          return regeneratorRuntime.awrap(ordersModel.find(query).populate({
            path: 'details',
            populate: [{
              path: 'seller',
              select: 'phone name email'
            }, {
              path: ' customer',
              select: 'phone name email'
            }, {
              path: 'assignservices',
              populate: 'services'
            }, {
              path: 'time_slot'
            }]
          }));

        case 8:
          orders = _context8.sent;
          res.status(200).json({
            status: 'success',
            data: {
              orders: orders
            }
          });
          _context8.next = 19;
          break;

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);

          if (!(_context8.t0.name === 'ValidationError')) {
            _context8.next = 18;
            break;
          }

          errors = {};
          Object.keys(_context8.t0.errors).forEach(function (key) {
            errors[key] = _context8.t0.errors[key].message;
          });
          return _context8.abrupt("return", res.status(400).send(errors));

        case 18:
          res.status(500).send('Something went wrong');

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.get_reservation = function _callee9(req, res) {
  var token, varified, orders, errors;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          token = req.header('Authorization');
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          _context9.next = 5;
          return regeneratorRuntime.awrap(order_detailsModel.find({
            customer: varified._id,
            status: 0,
            seller: req.body.seller
          }).populate([{
            path: 'time_slot',
            populate: {
              path: 'assignservices',
              populate: {
                path: 'services'
              }
            }
          }]));

        case 5:
          orders = _context9.sent;
          res.status(200).json({
            status: 'success',
            data: {
              orders: orders
            }
          });
          _context9.next = 16;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);

          if (!(_context9.t0.name === 'ValidationError')) {
            _context9.next = 15;
            break;
          }

          errors = {};
          Object.keys(_context9.t0.errors).forEach(function (key) {
            errors[key] = _context9.t0.errors[key].message;
          });
          return _context9.abrupt("return", res.status(400).send(errors));

        case 15:
          res.status(500).send(_context9.t0);

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
};