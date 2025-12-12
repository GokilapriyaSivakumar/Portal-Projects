// routes/profile.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profilecontrollers");

// GET -> /api/vendor/profile?vendorId=0000100000
router.get("/profile", profileController.getVendorProfile);

module.exports = router;
