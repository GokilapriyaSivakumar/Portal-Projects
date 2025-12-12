// // Backend/routes/payslip.js
// const express = require("express");
// const { payslipController } = require("../controllers/payslipcontrollers");

// const router = express.Router();

// router.get("/payslip", payslipController);

// module.exports = router;


// Backend/routes/payslip.js
const express = require("express");
const { downloadPayslipPDF } = require("../controllers/payslipcontrollers");

const router = express.Router();

// GET → fetch PDF
router.get("/payslip/pdf", downloadPayslipPDF);

module.exports = router;
