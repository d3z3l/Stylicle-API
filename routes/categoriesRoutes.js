const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const categoriesController = require('../controllers/categoriesController');
const router = express.Router();

router
  .route('/')
  .get(categoriesController.get)
  .post(auth,categoriesController.create)
router
  .route('/:id')
  .patch(auth,categoriesController.update)
  .delete(auth,categoriesController.delete); 
 

module.exports = router;
