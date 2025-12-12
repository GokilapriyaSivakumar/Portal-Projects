const express = require("express");
const router = express.Router();
const controller = require("../controllers/creditdebitcontrollers");

// GET /api/creditdebit?customerId=0000000003
router.get("/", controller.getCreditDebit);

module.exports = router;
