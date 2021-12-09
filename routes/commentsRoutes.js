const express = require('express');
const commentsController = require('../controllers/commentsController');

const router = express.Router();

router
  .route('/')
  .get(commentsController.getcomments)
  .post(commentsController.createcomments);


module.exports = router;
