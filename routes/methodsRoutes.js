const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const methodsController = require('../controllers/methodsController');
const router = express.Router();

router
  .route('/')
  .post(auth,methodsController.create)
  .get(methodsController.getAll);
// router
// .route('/:id')
// .get(auth,methodsController.get)
// .patch(auth,methodsController.update)
// .delete(auth,methodsController.delete);  
 
module.exports = router;
