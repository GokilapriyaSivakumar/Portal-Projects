// routes/rfq.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/rfqcontrollers");

// GET -> /api/vendor/rfq?vendorId=100000
router.get("/rfq", controller.getRfqData);

module.exports = router;
