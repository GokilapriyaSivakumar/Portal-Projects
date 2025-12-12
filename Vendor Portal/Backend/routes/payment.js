// routes/payment.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentcontrollers");

// GET -> /api/vendor/payment?vendorId=100000
router.get("/payment", controller.getPaymentData);

module.exports = router;
