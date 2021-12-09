const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const assignservicesController = require('../controllers/assignservicesController');
const router = express.Router();

router
  .route('/')
  .post(auth,assignservicesController.create)
  router
  .route('/:id')
  .get(auth,assignservicesController.get)
  .patch(auth,assignservicesController.update)
  .delete(auth,assignservicesController.delete); 
 

module.exports = router;
