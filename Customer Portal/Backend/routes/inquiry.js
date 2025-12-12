// Backend/routes/inquiry.js
const express = require("express");
const router = express.Router();

const { inquiryController } = require("../controllers/inquirycontrollers");

router.get("/", inquiryController);

module.exports = router;
