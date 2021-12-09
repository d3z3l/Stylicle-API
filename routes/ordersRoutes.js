const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const ordersController = require('../controllers/ordersController');
const router = express.Router();

router
  .route('/')
  .post(auth,ordersController.create)
router
  .route('/reservation')
  .post(auth,ordersController.create_reservation);
router
  .route('/view/reservation')
  .post(auth,ordersController.get_reservation)
router
.route('/:id')
.get(auth,ordersController.get)
.patch(auth,ordersController.update)
.delete(auth,ordersController.delete);  
router
.route('/cancel/:id')
.patch(auth,ordersController.cancel)
router
.route('/get_all')
.post(auth,ordersController.get_allorders)
 

module.exports = router;
