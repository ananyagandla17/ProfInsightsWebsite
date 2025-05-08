const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  getMyReviews
} = require('../controllers/reviewController');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Routes that don't require authentication
router.route('/')
  .get(
    advancedResults(Review, {
      path: 'professorId',
      select: 'name department'
    }),
    getReviews
  );

router.route('/:id')
  .get(getReview);

// Faculty-specific route to get only their reviews
router.route('/my-reviews')
  .get(protect, authorize('faculty'), getMyReviews);

// Protected routes for students
router.use(protect);

router.route('/')
  .post(authorize('student'), addReview);

router.route('/:id')
  .put(authorize('student', 'admin'), updateReview)
  .delete(authorize('student', 'admin'), deleteReview);

module.exports = router;