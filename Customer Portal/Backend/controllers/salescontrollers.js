const salesService = require("../services/salesservices");

exports.getCustomerSales = async (req, res) => {
    try {
        const customerId = req.query.customerId;
        if (!customerId) return res.status(400).json({ error: "customerId is required" });

        const data = await salesService.fetchSales(customerId);

        // send JSON directly
        res.json({ ET_SALES_ORDER_LIST: { item: data } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch sales data" });
    }
};
