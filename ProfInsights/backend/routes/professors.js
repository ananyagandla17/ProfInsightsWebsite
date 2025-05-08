const express = require('express');
const {
  getProfessors,
  getProfessor,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  searchProfessors
} = require('../controllers/professorController');

// Include review router for nested routes
const reviewRouter = require('./reviews');

const router = express.Router();

// Import auth middleware
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:professorId/reviews', reviewRouter);

// Search route
router.route('/search').get(searchProfessors);

// Main routes
router.route('/')
  .get(getProfessors)
  .post(protect, authorize('admin'), createProfessor);

router.route('/:id')
  .get(getProfessor)
  .put(protect, authorize('admin'), updateProfessor)
  .delete(protect, authorize('admin'), deleteProfessor);

module.exports = router;