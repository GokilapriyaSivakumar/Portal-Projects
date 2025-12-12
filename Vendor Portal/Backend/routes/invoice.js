// routes/invoice.js
const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoicecontrollers");

router.get("/invoice", invoiceController.getInvoices);

// NEW: Download PDF by BELNR
router.get("/invoice/pdf/:belnr", invoiceController.downloadPdf);

module.exports = router;
