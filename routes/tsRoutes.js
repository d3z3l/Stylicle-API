const express = require('express');
const auth = require('../middlewares/auth');
const mediaController = require('../controllers/mediaController');
const tsController = require('../controllers/tsController');
const router = express.Router();

router
  .route('/')
  .post(auth,tsController.create);
  router
  .route('/ts')
  .get(auth,tsController.get_tsModel);
router
  .route('/allts')
  .post(auth,tsController.get_all_tsModel);
router
  .route('/:id')
  .patch(auth,tsController.update)
  .delete(auth,tsController.delete); 
module.exports = router;
