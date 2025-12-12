const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliverycontroller");

// GET method as you requested
router.get("/", deliveryController.getDelivery);

module.exports = router;
