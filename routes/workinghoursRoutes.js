const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const workinghoursController = require('../controllers/workinghoursController');
const router = express.Router();

router
  .route('/')
  .post(workinghoursController.create)
router
  .route('/:id')
  .patch(auth,workinghoursController.update); 
 

module.exports = router;
