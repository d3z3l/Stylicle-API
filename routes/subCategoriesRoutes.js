const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const subCategoriesController = require('../controllers/subCategoriesController');
const router = express.Router();

router
  .route('/')
  .get(auth,subCategoriesController.get)
  .post(auth,subCategoriesController.create)
router
  .route('/:id')
  .patch(auth,subCategoriesController.update)
  .delete(auth,subCategoriesController.delete); 

 

module.exports = router;
