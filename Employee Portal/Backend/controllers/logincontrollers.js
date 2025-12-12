// Backend/controllers/logincontrollers.js
const { loginService } = require("../services/loginservices");
const xml2js = require("xml2js");

exports.loginController = async (req, res) => {
  try {
    const { empId, password } = req.body;

    if (!empId || !password) {
      return res.status(400).json({ message: "Employee ID and Password required" });
    }

    const soapResponse = await loginService(empId, password);

    // Convert XML → JSON
    xml2js.parseString(soapResponse, { explicitArray: false }, (err, result) => {
      if (err) return res.status(500).json({ message: "XML Parse Error" });

      const body =
        result["soap-env:Envelope"]["soap-env:Body"]
          ["n0:ZEMP_LOGIN_780_FMResponse"];

      return res.json({
        status: body.E_STATUS,
        message: body.E_MESSAGE
      });
    });

  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
