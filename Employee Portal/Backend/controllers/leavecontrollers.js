// Backend/controllers/leavecontrollers.js
const xml2js = require("xml2js");
const { leaveService } = require("../services/leaveservices");

exports.leaveController = async (req, res) => {
    try {
        const empId = req.query.empId;

        if (!empId) {
            return res.status(400).json({ message: "Employee ID is required" });
        }

        const soapResponse = await leaveService(empId);

        xml2js.parseString(soapResponse, { explicitArray: false }, (err, result) => {
            if (err) return res.status(500).json({ message: "XML Parsing Error" });

            const body =
                result["soap-env:Envelope"]["soap-env:Body"]
                    ["n0:ZEMP_LEAVE780_FMResponse"];

            const leaveData = body.ET_LEAVE_DATA.item;

            return res.json({
                message: body.E_MESSAGE,
                leaves: Array.isArray(leaveData) ? leaveData : [leaveData]
            });
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
