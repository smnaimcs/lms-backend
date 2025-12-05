const express = require('express');
const { setupBankInfo, getBalance, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.patch('/setup-bank', setupBankInfo);
router.get('/balance', getBalance);
router.get('/profile', getProfile);

module.exports = router;