const express = require('express');
const { getLMSBalance, getOrganizationStats } = require('../controllers/organizationController');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/balance', getLMSBalance);
router.get('/stats', getOrganizationStats);

module.exports = router;