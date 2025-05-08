const Professor = require('../models/Professor');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all professors
// @route   GET /api/professors
// @access  Public
exports.getProfessors = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Remove fields from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Professor.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Professor.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const professors = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: professors.length,
    pagination,
    data: professors
  });
});

// @desc    Get single professor
// @route   GET /api/professors/:id
// @access  Public
exports.getProfessor = asyncHandler(async (req, res, next) => {
  const professor = await Professor.findById(req.params.id);

  if (!professor) {
    return next(
      new ErrorResponse(`Professor not found with id of ${req.params.id}`, 404)
    );
  }

  // Get reviews for this professor
  const reviews = await Review.find({ 
    professorId: professor._id,
    moderationStatus: 'approved'
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      professor,
      reviews
    }
  });
});

// @desc    Create new professor
// @route   POST /api/professors
// @access  Private (Admin only)
exports.createProfessor = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.student.id;

  // Check if student is an admin
  if (req.student.role !== 'admin') {
    return next(
      new ErrorResponse(`Student is not authorized to add professors`, 403)
    );
  }

  const professor = await Professor.create(req.body);

  res.status(201).json({
    success: true,
    data: professor
  });
});

// @desc    Update professor
// @route   PUT /api/professors/:id
// @access  Private (Admin only)
exports.updateProfessor = asyncHandler(async (req, res, next) => {
  let professor = await Professor.findById(req.params.id);

  if (!professor) {
    return next(
      new ErrorResponse(`Professor not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if student is an admin
  if (req.student.role !== 'admin') {
    return next(
      new ErrorResponse(`Student is not authorized to update professors`, 403)
    );
  }

  professor = await Professor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: professor
  });
});

// @desc    Delete professor
// @route   DELETE /api/professors/:id
// @access  Private (Admin only)
exports.deleteProfessor = asyncHandler(async (req, res, next) => {
  const professor = await Professor.findById(req.params.id);

  if (!professor) {
    return next(
      new ErrorResponse(`Professor not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if student is an admin
  if (req.student.role !== 'admin') {
    return next(
      new ErrorResponse(`Student is not authorized to delete professors`, 403)
    );
  }

  await professor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Search professors
// @route   GET /api/professors/search
// @access  Public
exports.searchProfessors = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(
      new ErrorResponse('Please provide a search query', 400)
    );
  }

  // Search using text index
  const professors = await Professor.find({
    $text: { $search: query }
  }).sort({ averageRating: -1 });

  // If no results from text search, try regex
  if (professors.length === 0) {
    const regexProfessors = await Professor.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
        { courses: { $regex: query, $options: 'i' } },
        // Add these new fields to regex search
        { course: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ]
    }).sort({ averageRating: -1 });

    return res.status(200).json({
      success: true,
      count: regexProfessors.length,
      data: regexProfessors
    });
  }

  res.status(200).json({
    success: true,
    count: professors.length,
    data: professors
  });
});