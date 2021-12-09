const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const emploiesController = require('../controllers/emploiesController');
const router = express.Router();

router
  .route('/')
  .post(auth,emploiesController.create)
router
  .route('/:id')
  .patch(auth,emploiesController.update)
  .delete(auth,emploiesController.delete); 
 

module.exports = router;
