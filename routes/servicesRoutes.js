const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const servicesController = require('../controllers/servicesController');
const router = express.Router();

router
  .route('/')
  .get(servicesController.get)
  .post(auth,servicesController.create)
router
  .route('/Popular_Services')
  .get(servicesController.Popular_Services)
  router
  .route('/:id')
  .get(servicesController.get_search)
  .patch(auth,servicesController.update)
  .delete(auth,servicesController.delete); 

 
module.exports = router;
