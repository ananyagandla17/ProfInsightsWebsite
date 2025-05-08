const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  professorId: {
    type: Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  course: {
    type: String,
    trim: true
  },
  rating: {
    teaching: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    knowledge: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    organization: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    clarity: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    helpfulness: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    trim: true
  },
  reportedAt: {
    type: Date
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  moderationNotes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Hash of the user's IP for abuse prevention (not tracking identity)
  ipHash: {
    type: String,
    select: false // Don't include this in standard queries
  }
}, {
  timestamps: true
});

// Ensure student can only leave one review per professor
ReviewSchema.index({ professorId: 1, student: 1 }, { unique: true });

// Methods for moderation
ReviewSchema.methods.report = function(reason) {
  this.isReported = true;
  this.reportReason = reason;
  this.reportedAt = Date.now();
  this.moderationStatus = 'pending';
  return this.save();
};

ReviewSchema.methods.moderate = function(status, notes) {
  this.isModerated = true;
  this.moderationStatus = status;
  if (notes) {
    this.moderationNotes = notes;
  }
  return this.save();
};

// Pre-save hook for content moderation
ReviewSchema.pre('save', async function(next) {
  // If this is a new review or the comment has been modified
  if (this.isNew || this.isModified('comment')) {
    try {
      // Here you could add integration with AI moderation
      // For now, we'll implement basic filtering
      const inappropriateWords = [
        // List of words that trigger moderation
      ];
      
      const hasInappropriateContent = inappropriateWords.some(
        word => this.comment.toLowerCase().includes(word.toLowerCase())
      );
      
      if (hasInappropriateContent) {
        this.isModerated = true;
        this.moderationStatus = 'pending';
        this.moderationNotes = 'Contains potentially inappropriate content. Awaiting review.';
      }
    } catch (error) {
      console.error('Moderation error:', error);
    }
  }
  
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);