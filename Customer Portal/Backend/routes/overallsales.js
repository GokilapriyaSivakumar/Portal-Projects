// routes/overallsales.js

const express = require("express");
const router = express.Router();
const controller = require("../controllers/overallsalescontrollers");

router.get("/customer", controller.getOverallSales);

module.exports = router;
