const express = require('express');
const auth = require('../middlewares/auth');
const likesController = require('../controllers/likesController');
const router = express.Router();
router
  .route('/')
  .get(auth,likesController.get)
  .post(auth,likesController.create)
router
  .route('/:id/:post_id/:type')
  .get(auth,likesController.getbyActivity)
  .delete(auth,likesController.delete);
router
  .route('/verify')
  .post(auth,likesController.verify)

module.exports = router;
