// controllers/invoicecontrollers.js
const invoiceService = require("../services/invoiceservices");

// ----------------------------------------------------
// 1️⃣ Controller: Fetch invoice list by Vendor
// ----------------------------------------------------
exports.getInvoices = async (req, res) => {
  try {
    const vendorId = req.query.vendorId;

    if (!vendorId)
      return res.status(400).json({ message: "vendorId required" });

    const data = await invoiceService.getInvoiceData(vendorId);

    res.status(200).json({
      message: "Invoice Data Fetched Successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Invoice Fetch Failed",
      error: err.toString(),
    });
  }
};


// ----------------------------------------------------
// 2️⃣ Controller: Download PDF by BELNR
// ----------------------------------------------------
exports.downloadPdf = async (req, res) => {
  try {
    const belnr = req.params.belnr;

    if (!belnr)
      return res.status(400).json({ message: "belnr required" });

    const pdfBuffer = await invoiceService.getInvoicePdf(belnr);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${belnr}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);

  } catch (err) {
    res.status(500).json({
      message: "PDF Fetch Failed",
      error: err.toString(),
    });
  }
};
