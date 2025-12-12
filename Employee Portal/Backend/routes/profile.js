// Backend/routes/profile.js
const express = require("express");
const { profileController } = require("../controllers/profilecontrollers");

const router = express.Router();

router.get("/profile", profileController);

module.exports = router;
