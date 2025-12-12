// controllers/pocontrollers.js
const poService = require("../services/poservices");
const xml2js = require("xml2js");

exports.getPoData = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const xmlResponse = await poService.getPoData(vendorId);

    xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "XML parse error",
          error: err
        });
      }

      try {
        let entries = result.feed.entry;

        if (!Array.isArray(entries)) {
          entries = [entries];
        }

        const data = entries.map(entry => {
          const props = entry.content["m:properties"];

          return {
            VendorId: props["d:VendorId"],
            PoNumber: props["d:PoNumber"],
            DocType: props["d:DocType"],
            PurchaseOrg: props["d:PurchaseOrg"],
            DocDate: props["d:DocDate"],
            Material: props["d:Material"],
            ShortText: props["d:ShortText"],
            Quantity: props["d:Quantity"],
            Unit: props["d:Unit"],
            NetPrice: props["d:NetPrice"],
            Currency: props["d:Currency"],
            DeliveryDate: props["d:DeliveryDate"]
          };
        });

        return res.status(200).json({
          message: "PO data fetched successfully",
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
      message: "PO fetch failed",
      error: error.message
    });
  }
};
