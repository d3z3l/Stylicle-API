const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const packagesController = require('../controllers/packagesController');
const router = express.Router();

router
  .route('/')
  .post(auth,packagesController.create)
  .get(packagesController.getAll);
router
.route('/:id')
.get(packagesController.get)
.patch(auth,packagesController.update)
.delete(auth,packagesController.delete);  
 
module.exports = router;
