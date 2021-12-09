const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const e_walletsController = require('../controllers/e_walletsController');
const router = express.Router();

router
  .route('/')
  .post(auth,e_walletsController.create)
router
  .route('/:id')
  .patch(auth,e_walletsController.update); 
 

module.exports = router;
