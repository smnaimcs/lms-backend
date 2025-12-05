const mongoose = require('mongoose');

const lmsOrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'LMS Organization'
  },
  bankAccount: {
    accountNumber: String,
    balance: {
      type: Number,
      default: 1000000 // Initial LMS balance
    }
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalPayouts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LMSOrganization', lmsOrganizationSchema);