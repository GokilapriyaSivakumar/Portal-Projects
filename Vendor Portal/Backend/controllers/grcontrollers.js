// controllers/grcontrollers.js
const grService = require("../services/grservices");
const xml2js = require("xml2js");

exports.getGrData = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const xmlResponse = await grService.getGrData(vendorId);

    xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "XML parse error",
          error: err
        });
      }

      try {
        let entries = result.feed.entry;

        // Ensure entries is always an array
        if (!Array.isArray(entries)) {
          entries = [entries];
        }

        const data = entries.map(entry => {
          const props = entry.content["m:properties"];

          return {
            VendorId: props["d:VendorId"],
            MaterialDoc: props["d:MaterialDoc"],
            DocYear: props["d:DocYear"],
            ItemNumber: props["d:ItemNumber"],
            Material: props["d:Material"],
            Quantity: props["d:Quantity"],
            Unit: props["d:Unit"],
            PostingDate: props["d:PostingDate"],
            GrDate: props["d:GrDate"],
            PoNumber: props["d:PoNumber"],
            PoItem: props["d:PoItem"]
          };
        });

        return res.status(200).json({
          message: "GR data fetched successfully",
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
      message: "GR fetch failed",
      error: error.message
    });
  }
};
