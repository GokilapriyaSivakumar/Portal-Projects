const payDataService = require('../services/paydataservices');

// ====================== GET PAYDATA JSON ======================
exports.getPayData = async (req, res) => {
  try {
    const empId = req.query.empId;
    if (!empId) return res.status(400).json({ error: "Employee ID required" });

    const result = await payDataService.getPayData(empId);
    return res.status(200).json({ payData: result });

  } catch (err) {
    console.error("❌ PayData Fetch Error:", err);
    return res.status(500).json({ error: "Failed to fetch PayData" });
  }
};


// ====================== GET PAYDATA PDF ======================
exports.getPayDataPDF = async (req, res) => {
  try {
    const empId = req.query.empId;
    if (!empId) return res.status(400).json({ error: "Employee ID required" });

    const pdfBuffer = await payDataService.getPayDataPDF(empId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=PayData_${empId}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    return res.send(pdfBuffer);

  } catch (err) {
    console.error("❌ PayData PDF Error:", err);
    return res.status(500).json({ error: "Failed to fetch PayData PDF" });
  }
};
