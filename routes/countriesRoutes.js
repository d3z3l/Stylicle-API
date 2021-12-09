const express = require('express');
const auth = require('../middlewares/auth');
const countriesController = require('../controllers/countriesController');
const router = express.Router();

router
  .route('/')
  .get(countriesController.get)
router
  .route('/latlng/:id')
  .get(countriesController.getlatlngByid)

module.exports = router;
