const axios = require('axios');
const http = require('http');
const { parseString } = require('xml2js');

// ✅ SAP SERVICE
const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZPM_MAINT780_ODATA_SRV";

// ✅ BASIC AUTH
const AUTH_HEADER =
  "Basic SzkwMTc4MDpQcml5YUAxMjAz";

// ✅ HTTP Agent (for non-SSL SAP)
const agent = new http.Agent({ keepAlive: true });

async function validateLogin(engineerId, password) {
  const url = `${SAP_URL}/ZMAINT_LOGIN780Set(EngineerId='${engineerId}',Password='${password}')`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: AUTH_HEADER,
        "Content-Type": "application/json",
        Cookie: "sap-usercontext=sap-client=100"
      },
      httpAgent: agent
    });

    const rawData = response.data;

    // ✅ ✅ IF SAP RETURNS JSON → RETURN DIRECTLY
    if (typeof rawData === "object") {
      return {
        success: true,
        data: {
          EngineerId: rawData?.d?.EngineerId || rawData.EngineerId,
          Password: rawData?.d?.Password || rawData.Password,
          Status: rawData?.d?.Status || rawData.Status,
          StatusMsg: rawData?.d?.StatusMsg || rawData.StatusMsg
        }
      };
    }

    // ✅ ✅ ELSE PARSE XML SAFELY
    return new Promise((resolve, reject) => {
      parseString(rawData, { explicitArray: false }, (err, result) => {
        if (err) {
          console.error("❌ XML Parse Error:", err);
          return reject("Invalid XML Response from SAP");
        }

        try {
          const props = result.entry.content["m:properties"];

          resolve({
            success: true,
            data: {
              EngineerId: props["d:EngineerId"],
              Password: props["d:Password"],
              Status: props["d:Status"],
              StatusMsg: props["d:StatusMsg"]
            }
          });

        } catch (e) {
          console.error("❌ SAP Structure Error:", e);
          reject("Invalid SAP Login Structure");
        }
      });
    });

  } catch (error) {
    console.error("❌ SAP API Error:", error.message);
    throw new Error("SAP Login API Failed");
  }
}

module.exports = { validateLogin };
