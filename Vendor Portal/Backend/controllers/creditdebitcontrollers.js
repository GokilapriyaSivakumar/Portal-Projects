// controllers/creditdebitcontrollers.js
const creditDebitService = require("../services/creditdebitservices");
const xml2js = require("xml2js");

exports.getCreditDebit = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const xmlResponse = await creditDebitService.getCreditDebit(vendorId);

    xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "XML parse error",
          error: err
        });
      }

      try {
        let entries = result.feed.entry;

        // Ensure always array
        if (!Array.isArray(entries)) {
          entries = [entries];
        }

        const data = entries.map(entry => {
          const props = entry.content["m:properties"];

          return {
            VendorId: props["d:VendorId"],
            MemoNumber: props["d:MemoNumber"],
            FiscalYear: props["d:FiscalYear"],
            PostingDate: props["d:PostingDate"],
            DocHeaderText: props["d:DocHeaderText"],
            Amount: props["d:Amount"],
            Currency: props["d:Currency"],
            DocType: props["d:DocType"],
            CreatedBy: props["d:CreatedBy"],
            MemoType: props["d:MemoType"]
          };
        });

        return res.status(200).json({
          message: "Credit/Debit data fetched successfully",
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
      message: "Fetch failed",
      error: error.message
    });
  }
};
