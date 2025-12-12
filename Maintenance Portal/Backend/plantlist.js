const request = require('request');
const { parseString } = require('xml2js');

// ✅ YOUR SAP PLANT LIST SERVICE
const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZPM_MAINT780_ODATA_SRV/ZMAINT_PLANTLIST780Set";

// ✅ YOUR BASIC AUTH
const AUTH_HEADER =
  "Basic SzkwMTc4MDpQcml5YUAxMjAz";

// ✅ FUNCTION USED BY index.js
function getPlantList() {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: SAP_URL,
      headers: {
        Authorization: AUTH_HEADER,
        Cookie: "sap-usercontext=sap-client=100",
        "Content-Type": "application/json"
      },
      strictSSL: false
    };

    request(options, (error, response, body) => {
      if (error) return reject(error);

      parseString(body, { explicitArray: false }, (err, data) => {
        if (err) return reject("XML Parse Error");

        try {
          if (!data.feed || !data.feed.entry) {
            return resolve([]);
          }

          const entries = Array.isArray(data.feed.entry)
            ? data.feed.entry
            : [data.feed.entry];

          const cleaned = entries.map(entry => {
            const props = entry.content["m:properties"];

            return {
              MaintenanceEngineer: props["d:MaintenanceEngineer"],
              Werks: props["d:Werks"],
              Name1: props["d:Name1"],
              Stras: props["d:Stras"],
              Ort01: props["d:Ort01"],
              Land1: props["d:Land1"],
              Regio: props["d:Regio"]
            };
          });

          resolve(cleaned);

        } catch (parseError) {
          reject("Error extracting plant list data");
        }
      });
    });
  });
}

module.exports = { getPlantList };
