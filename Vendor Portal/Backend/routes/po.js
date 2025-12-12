// routes/po.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/pocontrollers");

// GET -> /api/vendor/po?vendorId=100000
router.get("/po", controller.getPoData);

module.exports = router;
