const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const featuresController = require('../controllers/featuresController');
const router = express.Router();

router
  .route('/')
  .get(auth,featuresController.get)
  .post(auth,featuresController.create)
router
  .route('/:id')
  .patch(auth,featuresController.update); 
 

module.exports = router;
