const express = require('express');
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const mediaController = require('../controllers/mediaController');
const router = express.Router();

  router
    .route('/upload')
    .post(auth,mediaController.uploadUserPhoto,userController.upload);

module.exports = router;
