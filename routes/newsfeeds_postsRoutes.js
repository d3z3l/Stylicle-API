const express = require('express');
const auth = require('../middlewares/auth');
const mediaController = require('../controllers/mediaController');
const newsfeeds_postsController = require('../controllers/newsfeeds_postsController');
const router = express.Router();

router
  .route('/')
  .post(auth,newsfeeds_postsController.create);
  router
  .route('/newsfeeds')
  .get(auth,newsfeeds_postsController.get_newsfeeds_posts);
router
  .route('/allnewsfeeds')
  .post(newsfeeds_postsController.get_all_newsfeeds_posts);
router
  .route('/allFeaturedsNewsfeeds')
  .get(newsfeeds_postsController.get_all_featured_newsfeeds_posts);
router
  .route('/:id')
  .patch(auth,newsfeeds_postsController.update)
  .delete(auth,newsfeeds_postsController.delete); 
module.exports = router;
