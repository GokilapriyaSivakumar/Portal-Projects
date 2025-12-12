const paymentService = require("../services/paymentservices");

exports.getPaymentList = async (req, res) => {
    try {
        const customerId = req.query.customerId;

        if (!customerId) {
            return res.status(400).json({ error: "customerId is required" });
        }

        const result = await paymentService.fetchPaymentList(customerId);
        res.status(200).send(result);  // send SAP XML as response
    } catch (error) {
        console.error("Error fetching payment list:", error);
        res.status(500).json({ error: "Failed to fetch payment list" });
    }
};
