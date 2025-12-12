const xml2js = require("xml2js");
const { inquiryService } = require("../services/inquiryservices");

// Helper to extract values ignoring SOAP namespaces
function getValueIgnoringNamespace(obj, key) {
    if (!obj) return null;
    return obj[Object.keys(obj).find(k => k.endsWith(key))];
}

async function inquiryController(req, res) {
    try {
        const { customerId } = req.query; // ✔ GET query

        if (!customerId) {
            return res.status(400).json({ message: "Customer ID missing" });
        }

        const xml = await inquiryService(customerId);

        xml2js.parseString(xml, { explicitArray: false }, (err, data) => {
            if (err) {
                return res.status(500).json({ error: "XML parsing failed" });
            }

            try {
                const envelope = getValueIgnoringNamespace(data, "Envelope");
                const body = getValueIgnoringNamespace(envelope, "Body");

                const response = getValueIgnoringNamespace(
                    body,
                    "ZCUST_INQUIRY780_FMResponse"
                );

                if (!response || !response.ET_INQUIRY_LIST) {
                    return res.status(500).json({ error: "Missing inquiry list" });
                }

                let inquiries = response.ET_INQUIRY_LIST.item;

                // If SAP returns only one inquiry => wrap into array
                if (!Array.isArray(inquiries)) {
                    inquiries = [inquiries];
                }

                return res.json({
                    customerId,
                    count: inquiries.length,
                    inquiries
                });

            } catch (err) {
                console.log("SAP RAW RESPONSE >>>", xml);
                return res.status(500).json({ error: "Invalid SOAP structure" });
            }
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { inquiryController };
