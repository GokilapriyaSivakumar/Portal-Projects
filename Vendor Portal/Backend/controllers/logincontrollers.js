// controllers/logincontrollers.js
const loginService = require("../services/loginservices");
const xml2js = require("xml2js");

exports.Login = async (req, res) => {
  try {
    const { vendorId, password } = req.body;

    if (!vendorId || !password) {
      return res.status(400).json({ message: "vendorId & password required" });
    }

    const xmlResponse = await loginService.Login(vendorId, password);

    // Convert XML → JSON
    xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "XML parse error", error: err });
      }

      try {
        const props =
          result.entry.content["m:properties"];

        const data = {
          VendorId: props["d:VendorId"],
          Password: props["d:Password"],
          Status: props["d:Status"],
          Message: props["d:Message"]
        };

        return res.status(200).json({
          message: "Login API Success",
          data
        });

      } catch (e) {
        return res.status(500).json({ message: "Data extraction failed", error: e });
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
};
