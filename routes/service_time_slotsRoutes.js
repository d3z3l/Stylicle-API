const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const service_time_slotsController = require('../controllers/service_time_slotsController');
const router = express.Router();

router
  .route('/')
  .post(auth,service_time_slotsController.create)
router
  .route('/manual')
  .post(auth,service_time_slotsController.create_manual)
router
  .route('/:id')
  .post(service_time_slotsController.get)
  .patch(auth,service_time_slotsController.update)
  .delete(auth,service_time_slotsController.delete); 
 

module.exports = router;
