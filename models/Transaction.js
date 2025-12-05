// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//   fromUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     // required: true
//   },
//   toUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   course: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course'
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ['course_purchase', 'instructor_payout', 'lms_fee', 'course_uploat_payout'],
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   bankReference: String,
//   description: String
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Transaction', transactionSchema);

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    // Remove required: true to make it optional
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: [
      'course_purchase', 
      'instructor_payout', 
      'course_upload_payout', // MAKE SURE THIS IS INCLUDED
      'lms_fee'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  bankReference: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);