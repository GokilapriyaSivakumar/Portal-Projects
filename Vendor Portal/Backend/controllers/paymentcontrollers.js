// controllers/paymentcontrollers.js
const paymentService = require("../services/paymentservices");
const xml2js = require("xml2js");

exports.getPaymentData = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const xmlResponse = await paymentService.getPaymentData(vendorId);

    xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "XML parse error",
          error: err
        });
      }

      try {
        let entries = result.feed.entry;

        // Convert single → array
        if (!Array.isArray(entries)) {
          entries = [entries];
        }

        const data = entries.map(entry => {
          const props = entry.content["m:properties"];

          return {
            VendorId: props["d:VendorId"],
            InvoiceNumber: props["d:InvoiceNumber"],
            FiscalYear: props["d:FiscalYear"],
            InvoiceDate: props["d:InvoiceDate"],
            DueDate: props["d:DueDate"],
            Amount: props["d:Amount"],
            Currency: props["d:Currency"],
            AgingDays: props["d:AgingDays"]
          };
        });

        return res.status(200).json({
          message: "Payment data fetched successfully",
          count: data.length,
          data
        });

      } catch (e) {
        return res.status(500).json({
          message: "Data extraction failed",
          error: e
        });
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Payment fetch failed",
      error: error.message
    });
  }
};
