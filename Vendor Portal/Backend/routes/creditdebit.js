// routes/creditdebit.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/creditdebitcontrollers");

// GET -> /api/vendor/creditdebit?vendorId=100000
router.get("/creditdebit", controller.getCreditDebit);

module.exports = router;
