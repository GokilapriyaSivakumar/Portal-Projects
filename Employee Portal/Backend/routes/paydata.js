const express = require('express');
const router = express.Router();
const payDataController = require('../controllers/paydatacontrollers');

// 🔹 JSON PayData
router.get('/paydata', payDataController.getPayData);

// 🔹 PDF Download
router.get('/paydata/pdf', payDataController.getPayDataPDF);

module.exports = router;
