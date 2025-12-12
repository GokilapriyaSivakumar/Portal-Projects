const invoiceService = require("../services/invoiceservices");

/* ======================================================
   INVOICE LIST
====================================================== */
exports.getInvoiceList = async (req, res) => {
    try {
        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ message: "customerId is required" });
        }

        const data = await invoiceService.fetchInvoiceList(customerId);
        return res.status(200).json(data);

    } catch (error) {
        console.error("Invoice fetch error:", error);
        return res.status(500).json({ message: "Error fetching invoices" });
    }
};

/* ======================================================
   DOWNLOAD PDF
====================================================== */
exports.downloadInvoicePDF = async (req, res) => {
    try {
        const { vbeln } = req.body;

        if (!vbeln) {
            return res.status(400).json({ message: "vbeln is required" });
        }

        const pdfBuffer = await invoiceService.fetchInvoicePDF(vbeln);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=invoice_${vbeln}.pdf`,
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Invoice PDF error:", error);
        return res.status(500).json({ message: "Error downloading PDF" });
    }
};
