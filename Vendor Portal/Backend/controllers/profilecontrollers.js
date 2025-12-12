// controllers/profilecontrollers.js
const profileService = require("../services/profileservices");
const xml2js = require("xml2js");

exports.getVendorProfile = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const xmlResponse = await profileService.getVendorProfile(vendorId);

    xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "XML parsing failed",
          error: err
        });
      }

      try {
        const props = result.entry.content["m:properties"];

        const data = {
          VendorId: props["d:VendorId"],
          Name: props["d:Name"],
          Street: props["d:Street"],
          City: props["d:City"],
          PostalCode: props["d:PostalCode"],
          Country: props["d:Country"],
          Email: props["d:Email"],
          Telephone: props["d:Telephone"]
        };

        return res.status(200).json({
          message: "Profile fetch successful",
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
      message: "Profile fetch failed",
      error: error.message
    });
  }
};
