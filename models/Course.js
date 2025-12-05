const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  materials: [{
    type: {
      type: String,
      enum: ['text', 'audio', 'video', 'mcq'],
      required: true
    },
    title: String,
    content: String, // URL or text content
    duration: Number, // in minutes
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  }],
  instructorPayout: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);