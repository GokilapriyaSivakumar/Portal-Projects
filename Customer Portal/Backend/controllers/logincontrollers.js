// Backend/controllers/logincontrollers.js
const { loginService } = require("../services/loginservices");
const xml2js = require("xml2js");

async function loginController(req, res) {
    try {
        const { customerId, password } = req.body;

        if (!customerId || !password) {
            return res.status(400).json({ message: "Missing inputs" });
        }

        const xmlResponse = await loginService(customerId, password);

        // Convert XML → JSON
        xml2js.parseString(xmlResponse, (err, result) => {
            if (err) return res.status(500).json({ error: "XML parse error" });

            try {
                const body = result["soap-env:Envelope"]["soap-env:Body"][0];
                const data =
                    body["n0:ZCUSTOMER_LOGIN_780Response"][0];

                const flag = data["EV_FLAG"][0];
                const message = data["EV_MESSAGE"][0];

                return res.json({ flag, message });
            } catch (e) {
                return res.status(500).json({ error: "Invalid SOAP format" });
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { loginController };
