const Review = require('../models/Review'); // Adjust to your model structure
const Professor = require('../models/Professor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // If a professor ID is in the URL params, filter reviews by professor
  if (req.params.professorId) {
    const reviews = await Review.find({ professorId: req.params.professorId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'professorId',
    select: 'name department course code'
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Add review
// @route   POST /api/professors/:professorId/reviews
// @access  Private (Students only)
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.professorId = req.params.professorId;
  req.body.studentId = req.student ? req.student.id : req.user.id; // Support both auth schemas

  const professor = await Professor.findById(req.params.professorId);

  if (!professor) {
    return next(
      new ErrorResponse(
        `No professor found with id of ${req.params.professorId}`,
        404
      )
    );
  }

  // Calculate average rating from criteria
  const ratings = req.body.ratings || {};
  const ratingValues = Object.values(ratings).filter(v => !isNaN(parseFloat(v)));
  
  if (ratingValues.length > 0) {
    const sum = ratingValues.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    req.body.averageRating = (sum / ratingValues.length).toFixed(1);
  } else {
    req.body.averageRating = 0;
  }

  const review = await Review.create(req.body);

  // Update professor's rating statistics
  await professor.updateRatings(req.app.locals.db);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Get reviews for the currently logged-in faculty
// @route   GET /api/reviews/my-reviews
// @access  Private (Faculty only)
exports.getMyReviews = asyncHandler(async (req, res, next) => {
  // Check if user is faculty
  if (!req.user || req.user.role !== 'faculty') {
    return next(
      new ErrorResponse('Not authorized to access this resource', 403)
    );
  }

  // Find the professor document for this faculty user
  const professor = await Professor.findOne({ 
    _id: req.user.id 
  });

  if (!professor) {
    return next(
      new ErrorResponse('Faculty profile not found', 404)
    );
  }

  // Find all reviews for this professor
  const reviews = await Review.find({ 
    professorId: professor._id 
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to student or user is admin
  if (
    (req.student && review.studentId.toString() !== req.student.id) &&
    req.student.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `Not authorized to update this review`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Update professor's rating statistics
  const professor = await Professor.findById(review.professorId);
  if (professor) {
    await professor.updateRatings(req.app.locals.db);
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to student or user is admin
  if (
    (req.student && review.studentId.toString() !== req.student.id) &&
    req.student.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `Not authorized to delete this review`,
        401
      )
    );
  }

  await review.remove();

  // Update professor's rating statistics
  const professor = await Professor.findById(review.professorId);
  if (professor) {
    await professor.updateRatings(req.app.locals.db);
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});