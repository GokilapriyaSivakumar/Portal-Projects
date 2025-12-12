// routes/gr.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/grcontrollers");

// GET -> /api/vendor/gr?vendorId=100000
router.get("/gr", controller.getGrData);

module.exports = router;
