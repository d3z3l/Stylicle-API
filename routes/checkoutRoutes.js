const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const checkoutController = require('../controllers/checkoutController');
const router = express.Router();

router
  .route('/')
  .post(checkoutController.create)

module.exports = router;
