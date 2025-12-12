// services/creditdebitservices.js
const request = require("request");

exports.getCreditDebit = (vendorId) => {
  return new Promise((resolve, reject) => {
    const url =
      `http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VEND780_ODATA_SRV/` +
      `ZVEND_CREDDEB780Set?$filter=VendorId eq '${vendorId}'`;

    const options = {
      method: "GET",
      url: url,
      headers: {
        "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
        "Cookie": "sap-usercontext=sap-client=100"
      }
    };

    request(options, (error, response) => {
      if (error) return reject(error);
      resolve(response.body);
    });
  });
};
