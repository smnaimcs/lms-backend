const express = require('express');
const { 
  purchaseCourse, 
  getTransactions, 
  validateAndCollectPayout,
  getPendingPayouts 
} = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.post('/purchase', purchaseCourse);
router.get('/', getTransactions);

// Instructor only routes
router.get('/pending-payouts', restrictTo('instructor'), getPendingPayouts);
router.post('/validate-payout', restrictTo('instructor'), validateAndCollectPayout);

module.exports = router;