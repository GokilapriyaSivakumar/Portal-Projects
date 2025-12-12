const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profilecontrollers");

// GET /api/profile?kunnr=0000000001
router.get("/", profileController.getProfile);

module.exports = router;
