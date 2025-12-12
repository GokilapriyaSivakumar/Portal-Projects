const xml2js = require("xml2js");
const deliveryService = require("../services/deliveryservices");

exports.getDelivery = async (req, res) => {
    try {
        const customerId = req.query.customerId;

        if (!customerId) {
            return res.status(400).json({ error: "customerId is required in query" });
        }

        const xmlResponse = await deliveryService.getDeliveryList(customerId);

        xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Failed to parse XML" });
            }

            try {
                const items =
                    result["soap-env:Envelope"]["soap-env:Body"]["n0:ZCUST_DEL780_FMResponse"]
                        ["ET_DELIVERY_LIST"]["item"];

                res.status(200).json({ deliveryList: items });
            } catch (e) {
                res.status(500).json({ error: "Invalid SAP response format" });
            }
        });
    } catch (err) {
        res.status(500).json({ error: "SAP request failed", details: err.message });
    }
};
