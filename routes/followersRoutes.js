const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const followersController = require('../controllers/followersController');
const router = express.Router();

router
  .route('/')
  .post(auth,followersController.create);
router
  .route('/followees')
  .get(auth,followersController.get_followees);
router
  .route('/followers_varify')
  .post(auth,followersController.followers_varify);
router
  .route('/followers')
  .get(auth,followersController.get_followers);
router
  .route('/:id')
  .patch(auth,followersController.update)
  .delete(auth,followersController.delete); 
 

module.exports = router;
