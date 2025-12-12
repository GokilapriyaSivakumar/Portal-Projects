const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoicecontrollers");

// POST - fetch invoice list
router.post("/", invoiceController.getInvoiceList);

// POST - download PDF
router.post("/download", invoiceController.downloadInvoicePDF);

module.exports = router;
