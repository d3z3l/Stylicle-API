const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router
  .route('/')
  .post(auth,transactionController.create)
router
  .route('/admin')
  .post(auth,transactionController.create_admin)
router
  .route('/admin_cash')
  .post(auth,transactionController.create_cash_admin)
router
  .route('/get_by_users/:id')
  .get(auth,transactionController.get_by_users)

module.exports = router;
