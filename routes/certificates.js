const express = require('express');
const { generateCertificate, getCertificates, verifyCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.post('/generate', generateCertificate);
router.get('/mine', getCertificates);
router.get('/verify/:certificateId', verifyCertificate);

module.exports = router;