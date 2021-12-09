const express = require('express');
const auth = require('../middlewares/auth');
const commentsnewController = require('../controllers/commentsnewController');
const router = express.Router();

router
  .route('/')
  .get(auth,commentsnewController.get)
  .post(auth,commentsnewController.create)
router
  .route('/ts')
  .get(auth,commentsnewController.get)
  .post(auth,commentsnewController.create_ts)
router
  .route('/:id/:post_id')
  .delete(auth,commentsnewController.delete);

module.exports = router;
