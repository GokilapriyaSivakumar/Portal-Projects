const express = require('express');
const request = require('request');
const { parseString } = require('xml2js');

const router = express.Router();

// ✅ YOUR SAP WORKORDER SERVICE
const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZPM_MAINT780_ODATA_SRV/ZMAINT780_WORKORDERSet";

// ✅ YOUR BASIC AUTH
const AUTH_HEADER =
  "Basic SzkwMTc4MDpQcml5YUAxMjAz";

// ✅ SUPPORT GET METHOD
router.get('/', (req, res) => {
  const { sowrk } = req.query;

  if (!sowrk) {
    return res.status(400).json({
      success: false,
      error: "Missing sowrk parameter"
    });
  }

  const url = `${SAP_URL}?$filter=Sowrk eq '${sowrk}'`;

  const options = {
    method: "GET",
    url: url,
    headers: {
      Authorization: AUTH_HEADER,
      Cookie: "sap-usercontext=sap-client=100",
      "Content-Type": "application/json"
    },
    strictSSL: false
  };

  request(options, (error, response, body) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    parseString(body, { explicitArray: false }, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "XML Parse Error"
        });
      }

      if (!data.feed || !data.feed.entry) {
        return res.json({
          success: true,
          data: []
        });
      }

      const entries = Array.isArray(data.feed.entry)
        ? data.feed.entry
        : [data.feed.entry];

      const cleaned = entries.map(entry => {
        const props = entry.content["m:properties"];

        return {
          Aufnr: props["d:Aufnr"],
          Auart: props["d:Auart"],
          Ktext: props["d:Ktext"],
          Erdat: props["d:Erdat"],
          Autyp: props["d:Autyp"],
          Bukrs: props["d:Bukrs"],
          Sowrk: props["d:Sowrk"],
          Werks: props["d:Werks"],
          Kappl: props["d:Kappl"],
          Kalsm: props["d:Kalsm"],
          Vaplz: props["d:Vaplz"],
          Kostl: props["d:Kostl"],
          Phas0: props["d:Phas0"],
          Phas1: props["d:Phas1"],
          Phas2: props["d:Phas2"],
          Phas3: props["d:Phas3"]
        };
      });

      res.json({
        success: true,
        data: cleaned
      });
    });
  });
});

module.exports = router;
