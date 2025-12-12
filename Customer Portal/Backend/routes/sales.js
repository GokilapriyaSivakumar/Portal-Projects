const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salescontrollers");

router.get("/customer", salesController.getCustomerSales);

module.exports = router;
