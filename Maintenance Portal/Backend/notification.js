const express = require("express");
const request = require("request");

const router = express.Router();

// ✅ SAP NOTIFICATION SERVICE
const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZPM_MAINT780_ODATA_SRV/ZMAINT_NOTIFY780Set";

// ✅ BASIC AUTH
const AUTH_HEADER = "Basic SzkwMTc4MDpQcml5YUAxMjAz";

// ✅ GET NOTIFICATIONS BY PLANT (IWERK)
router.get("/", (req, res) => {
  const { iwerk } = req.query;

  if (!iwerk) {
    return res.status(400).json({
      success: false,
      error: "Missing iwerk parameter",
    });
  }

  const url = `${SAP_URL}?$filter=Iwerk eq '${iwerk}'&$format=json`;

  const options = {
    method: "GET",
    url,
    headers: {
      Authorization: AUTH_HEADER,
      Cookie: "sap-usercontext=sap-client=100",
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error("❌ SAP Network Error:", error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    try {
      const sapResp = JSON.parse(body);

      const results = sapResp?.d?.results || [];

      // ✅ CLEAN & SAFE RESPONSE FOR FLUTTER
      const cleaned = results.map((n) => ({
        Qmnum: n.Qmnum || "",
        Iwerk: n.Iwerk || "",
        Iloan: n.Iloan || "",
        Equnr: n.Equnr || "",
        Ausvn: n.Ausvn || "",
        Qmtxt: n.Qmtxt || "",
        Priok: n.Priok || "",
        Erdat: n.Erdat || "",
        Abckz: n.Abckz || "",
        Strmn: n.Strmn || "",
        Strur: n.Strur || "",
        Aufnr: n.Aufnr || "",
        Arbplwerk: n.Arbplwerk || "",
      }));

      res.json({
        success: true,
        count: cleaned.length,
        data: cleaned,
      });
    } catch (err) {
      console.error("❌ SAP JSON Parse Error:", err.message);
      res.status(500).json({
        success: false,
        error: "Invalid SAP JSON response",
      });
    }
  });
});

module.exports = router;
