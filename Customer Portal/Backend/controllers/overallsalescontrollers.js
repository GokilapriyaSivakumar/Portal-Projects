// controllers/overallsalescontrollers.js

const overallSalesService = require("../services/overallsalesservices");

exports.getOverallSales = async (req, res) => {
    try {
        const customerId = req.query.customerId;
        if (!customerId) {
            return res.status(400).json({ error: "customerId is required" });
        }

        const result = await overallSalesService.fetchOverallSales(customerId);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Overall Sales Controller Error:", error);
        return res.status(500).json({ error: "SAP service request failed" });
    }
};
