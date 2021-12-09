const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const reviewsController = require('../controllers/reviewsController');
const router = express.Router();

router
  .route('/')
  .post(auth,reviewsController.create)
router
  .route('/:id')
  .patch(auth,reviewsController.update); 
 

module.exports = router;
