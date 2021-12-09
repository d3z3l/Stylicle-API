"use strict";

var e_walletsModel = require('../models/e_walletsModel');

var transactionModel = require('../models/transactionModel');

var usersModel = require('../models/usersModel');

var jwt = require('jsonwebtoken');

var catchAsync = require('../utils/catchAsync');

var bcrypt = require('bcryptjs');

var _require = require('morgan'),
    token = _require.token;

exports.create = function _callee(req, res) {
  var token, varified, transaction, sender, receiver, reseivable_price, admin, admin_wallets, sender_wallets, receiver_wallets, errors;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.header('Authorization');
          _context.prev = 1;
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          _context.next = 5;
          return regeneratorRuntime.awrap(transactionModel.create(req.body));

        case 5:
          transaction = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: req.body.sender
          }));

        case 8:
          sender = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: req.body.receiver
          }).populate('package'));

        case 11:
          receiver = _context.sent;
          reseivable_price = req.body.amount;

          if (!(receiver.subscription == 0)) {
            _context.next = 21;
            break;
          }

          reseivable_price -= receiver["package"][0].price_2;
          _context.next = 17;
          return regeneratorRuntime.awrap(usersModel.findOne({
            role_id: "2"
          }));

        case 17:
          admin = _context.sent;
          _context.next = 20;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: admin.e_wallet[0]
          }, {
            $inc: {
              'ballence': receiver["package"][0].price_2
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 20:
          admin_wallets = _context.sent;

        case 21:
          if (!(req.body.method == "wallet")) {
            _context.next = 31;
            break;
          }

          console.log(''); // var sender_wallets = await e_walletsModel.findOne({ _id: user._id });

          _context.next = 25;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: sender.e_wallet[0]
          }, {
            $inc: {
              'ballence': -req.body.amount
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 25:
          sender_wallets = _context.sent;
          _context.next = 28;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: receiver.e_wallet[0]
          }, {
            $inc: {
              'ballence': reseivable_price
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 28:
          receiver_wallets = _context.sent;
          _context.next = 37;
          break;

        case 31:
          if (!(req.body.method == "Cash")) {
            _context.next = 34;
            break;
          }

          _context.next = 37;
          break;

        case 34:
          _context.next = 36;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: receiver.e_wallet[0]
          }, {
            $inc: {
              'ballence': reseivable_price
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 36:
          receiver_wallets = _context.sent;

        case 37:
          res.status(200).json({
            status: true
          });
          _context.next = 48;
          break;

        case 40:
          _context.prev = 40;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);

          if (!(_context.t0.name === 'ValidationError')) {
            _context.next = 47;
            break;
          }

          errors = {};
          Object.keys(_context.t0.errors).forEach(function (key) {
            errors[key] = _context.t0.errors[key].message;
          });
          return _context.abrupt("return", res.status(400).send(errors));

        case 47:
          res.status(500).send('Something went wrong');

        case 48:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 40]]);
};

exports.create_admin = function _callee2(req, res) {
  var token, varified, transaction, sender, receiver, sender_wallets, receiver_wallets, errors;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = req.header('Authorization');
          _context2.prev = 1;
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          _context2.next = 5;
          return regeneratorRuntime.awrap(transactionModel.create(req.body));

        case 5:
          transaction = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: req.body.sender
          }));

        case 8:
          sender = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(usersModel.findOne({
            role_id: "2"
          }));

        case 11:
          receiver = _context2.sent;
          console.log(req.body.method);

          if (!(req.body.method == "wallet")) {
            _context2.next = 24;
            break;
          }

          console.log(''); // var sender_wallets = await e_walletsModel.findOne({ _id: user._id });

          _context2.next = 17;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: sender.e_wallet[0]
          }, {
            $inc: {
              'ballence': -req.body.amount
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 17:
          sender_wallets = _context2.sent;
          _context2.next = 20;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: receiver.e_wallet[0]
          }, {
            $inc: {
              'ballence': req.body.amount
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 20:
          receiver_wallets = _context2.sent;
          console.log('33333333333333333333');
          _context2.next = 31;
          break;

        case 24:
          if (!(req.body.method == "Cash")) {
            _context2.next = 27;
            break;
          }

          _context2.next = 31;
          break;

        case 27:
          _context2.next = 29;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: receiver.e_wallet[0]
          }, {
            $inc: {
              'ballence': req.body.amount
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 29:
          receiver_wallets = _context2.sent;
          console.log('4444444444444444444444');

        case 31:
          res.status(200).json({
            status: true
          });
          _context2.next = 42;
          break;

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](1);
          console.log(_context2.t0);

          if (!(_context2.t0.name === 'ValidationError')) {
            _context2.next = 41;
            break;
          }

          errors = {};
          Object.keys(_context2.t0.errors).forEach(function (key) {
            errors[key] = _context2.t0.errors[key].message;
          });
          return _context2.abrupt("return", res.status(400).send(errors));

        case 41:
          res.status(500).send('Something went wrong');

        case 42:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 34]]);
};

exports.create_cash_admin = function _callee3(req, res) {
  var token, varified, transaction, sender, receiver, sender_wallets, receiver_wallets, errors;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          token = req.header('Authorization');
          _context3.prev = 1;
          varified = jwt.verify(token, process.env.TOKEN_SECRET);
          _context3.next = 5;
          return regeneratorRuntime.awrap(transactionModel.create(req.body));

        case 5:
          transaction = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: req.body.sender
          }));

        case 8:
          sender = _context3.sent;
          _context3.next = 11;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: req.body.receiver
          }).populate('package'));

        case 11:
          receiver = _context3.sent;
          console.log(req.body.method); // var sender_wallets = await e_walletsModel.findOne({ _id: user._id });

          _context3.next = 15;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: sender.e_wallet[0]
          }, {
            $inc: {
              'ballence': req.body.amount
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 15:
          sender_wallets = _context3.sent;
          console.log(receiver);

          if (!(receiver.subscription == 0)) {
            _context3.next = 21;
            break;
          }

          _context3.next = 20;
          return regeneratorRuntime.awrap(e_walletsModel.findOneAndUpdate({
            _id: receiver.e_wallet[0]
          }, {
            $inc: {
              'due_ballence': receiver["package"][0].price_2
            },
            $push: {
              transaction: transaction._id
            }
          }, {
            "new": true,
            runValidators: true
          }));

        case 20:
          receiver_wallets = _context3.sent;

        case 21:
          res.status(200).json({
            status: true
          });
          _context3.next = 32;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](1);
          console.log(_context3.t0);

          if (!(_context3.t0.name === 'ValidationError')) {
            _context3.next = 31;
            break;
          }

          errors = {};
          Object.keys(_context3.t0.errors).forEach(function (key) {
            errors[key] = _context3.t0.errors[key].message;
          });
          return _context3.abrupt("return", res.status(400).send(errors));

        case 31:
          res.status(500).send('Something went wrong');

        case 32:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 24]]);
};

exports.update = function _callee4(req, res) {
  var _id, transaction, errors;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(transactionModel.findOneAndUpdate({
            _id: _id
          }, req.body, {
            "new": true,
            runValidators: true
          }));

        case 4:
          transaction = _context4.sent;
          res.status(200).json({
            status: 'success',
            data: {
              transaction: transaction
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

exports.get_by_users = function _callee5(req, res) {
  var _id, user, query, transaction, errors;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _id = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(usersModel.findOne({
            _id: _id
          }));

        case 4:
          user = _context5.sent;
          query = {};

          if (user.role_id == '0') {
            query["sender"] = _id;
          } else {
            query["receiver"] = _id;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(transactionModel.find(query).populate([{
            path: 'sender',
            select: 'name'
          }, {
            path: 'receiver',
            select: 'name'
          }]));

        case 9:
          transaction = _context5.sent;
          res.status(200).json({
            status: 'success',
            data: {
              transaction: transaction
            }
          });
          _context5.next = 20;
          break;

        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);

          if (!(_context5.t0.name === 'ValidationError')) {
            _context5.next = 19;
            break;
          }

          errors = {};
          Object.keys(_context5.t0.errors).forEach(function (key) {
            errors[key] = _context5.t0.errors[key].message;
          });
          return _context5.abrupt("return", res.status(400).send(errors));

        case 19:
          res.status(500).send('Something went wrong');

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 13]]);
};