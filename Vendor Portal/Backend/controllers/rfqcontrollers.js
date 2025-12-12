// controllers/rfqcontrollers.js
const rfqService = require("../services/rfqservices");
const xml2js = require("xml2js");

exports.getRfqData = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const xmlResponse = await rfqService.getRfqData(vendorId);

    xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "XML parse error",
          error: err
        });
      }

      try {
        let entries = result.feed.entry;

        // Ensure array
        if (!Array.isArray(entries)) {
          entries = [entries];
        }

        const data = entries.map(entry => {
          const props = entry.content["m:properties"];

          return {
            VendorId: props["d:VendorId"],
            RfqNumber: props["d:RfqNumber"],
            DocType: props["d:DocType"],
            PurchaseOrg: props["d:PurchaseOrg"],
            DocDate: props["d:DocDate"],
            MatNumber: props["d:MatNumber"],
            ShortText: props["d:ShortText"],
            Quantity: props["d:Quantity"],
            UnitMeasure: props["d:UnitMeasure"],
            NetPrice: props["d:NetPrice"],
            Currency: props["d:Currency"]
          };
        });

        return res.status(200).json({
          message: "RFQ data fetched successfully",
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
      message: "RFQ fetch failed",
      error: error.message
    });
  }
};
