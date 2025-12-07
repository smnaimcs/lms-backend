// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   instructor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   materials: [{
//     type: {
//       type: String,
//       enum: ['text', 'audio', 'video', 'mcq'],
//       required: true
//     },
//     title: String,
//     content: String, // URL or text content
//     duration: Number, // in minutes
//     questions: [{
//       question: String,
//       options: [String],
//       correctAnswer: Number
//     }]
//   }],
//   instructorPayout: {
//     type: Number,
//     required: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Course', courseSchema);

const mongoose = require('mongoose');

const courseMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'video', 'audio', 'mcq', 'pdf', 'presentation'],
    required: true
  },
  content: {
    // For text: the actual text content
    // For video/audio: URL to the file
    // For MCQ: array of questions
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const courseSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  materials: [courseMaterialSchema],
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

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
  thumbnail: {
    type: String,
    default: ''
  },
  sections: [courseSectionSchema],
  instructorPayout: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  totalMaterials: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
courseSchema.pre('save', function(next) {
  let totalDuration = 0;
  let totalMaterials = 0;
  
  this.sections.forEach(section => {
    section.materials.forEach(material => {
      totalDuration += material.duration || 0;
      totalMaterials++;
    });
  });
  
  this.totalDuration = totalDuration;
  this.totalMaterials = totalMaterials;
  next();
});

module.exports = mongoose.model('Course', courseSchema);