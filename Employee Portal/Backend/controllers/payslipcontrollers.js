

// Backend/controllers/payslipcontrollers.js
const { fetchPayslipPDF } = require("../services/payslipservices");

exports.downloadPayslipPDF = async (req, res) => {
  try {
    const { empId } = req.query;   // GET parameter

    if (!empId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const pdfBuffer = await fetchPayslipPDF(empId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=payslip_${empId}.pdf`,
      "Content-Length": pdfBuffer.length
    });

    return res.send(pdfBuffer);

  } catch (error) {
    console.error("Error fetching payslip PDF:", error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message || error 
    });
  }
};
