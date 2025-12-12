const creditDebitService = require("../services/creditdebitservices");

exports.getCreditDebit = async (req, res) => {
    console.log("CREDIT/DEBIT HIT:", req.query.customerId);

    try {
        const customerId = req.query.customerId;

        if (!customerId)
            return res.status(400).json({ error: "customerId is required" });

        const xml = await creditDebitService.fetchCreditDebit(customerId);

        return res.status(200).send(xml); // send XML string directly
    } 
    catch (err) {
        console.error("Error fetching credit/debit:", err);
        res.status(500).json({ error: "Failed to fetch credit/debit list" });
    }
};
