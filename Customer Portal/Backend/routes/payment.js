const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentcontrollers");

// GET /api/payment?customerId=0000000003
router.get("/", paymentController.getPaymentList);

module.exports = router;
