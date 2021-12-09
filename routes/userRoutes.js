const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('./../controllers/userController');
const mediaController = require('./../controllers/mediaController');
const router = express.Router();

router
  .route('/register')
  .post(userController.createUser);
router
  .route('/login')
  .post(userController.login);
router
  .route('/forget_password')
  .post(userController.forget_password);
  
router
  .route('/password')
  .patch(auth,userController.passwordUser);
router
  .route('/getUser_by_id/:id')
  .get(userController.getUser_by_id);
router
  .route('/getAllsellers')
  .post(userController.getAllsellers);
router
  .route('/getAllsellersAdmin')
  .get(userController.getAllsellers_admin);
router
  .route('/getAllbuyersAdmin')
  .get(userController.getAllbuyersAdmin);
  

  router
  .route('/:id')
  .patch(auth,userController.updateUser_by_id);
  router
  .route('/')
  .get(auth,userController.getUser)
  .patch(auth,userController.updateUser);
router
  .route('/schedule')
  .get(auth,userController.schedule)
router
  .route('/groups')
  .get(auth,userController.groups)
router
  .route('/groups_tocken')
  .post(auth,userController.groups_tocken)
  

module.exports = router;
