// Backend/routes/leave.js
const express = require("express");
const { leaveController } = require("../controllers/leavecontrollers");

const router = express.Router();

router.get("/leave", leaveController);

module.exports = router;
