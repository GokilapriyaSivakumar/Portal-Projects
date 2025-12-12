const request = require('request');
const xml2js = require('xml2js');

// =======================================================
// 🔹 FETCH PAYDATA LIST (JSON)
// =======================================================
exports.getPayData = (empId) => {
  return new Promise((resolve, reject) => {

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZEMP_PAYDATA899_FM>
            <EMPLOYEE_ID>${empId}</EMPLOYEE_ID>
          </urn:ZEMP_PAYDATA899_FM>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const options = {
      method: 'POST',
      url: 'http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_paydataservice899?sap-client=100',
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic SzkwMTg5OTpTaW5kaHVAMjAwMw==',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions'
      },
      body: soapBody
    };

    request(options, (err, resp, body) => {
      if (err) return reject(err);

      xml2js.parseString(body, { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        try {
          const list =
            result["soap-env:Envelope"]["soap-env:Body"]["n0:ZEMP_PAYDATA899_FMResponse"]["PAYSLIP_DETAILS"]["item"];
          
          resolve(Array.isArray(list) ? list : [list]);

        } catch {
          reject("Invalid SAP PayData Response Structure");
        }
      });
    });
  });
};


// =======================================================
// 🔹 FETCH PAYDATA PDF
// =======================================================
exports.getPayDataPDF = (empId) => {
  return new Promise((resolve, reject) => {

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
       xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZEMP_PAYPDF899_FM>
            <EMPLOYEE_ID>${empId}</EMPLOYEE_ID>
          </urn:ZEMP_PAYPDF899_FM>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const options = {
      method: 'POST',
      url: 'http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_paypdfservice899?sap-client=100',
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic SzkwMTg5OTpTaW5kaHVAMjAwMw==',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions'
      },
      body: soapBody
    };

    request(options, (err, resp, body) => {
      if (err) return reject(err);

      xml2js.parseString(body, { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        try {
          const pdf = result["soap-env:Envelope"]["soap-env:Body"]["n0:ZEMP_PAYPDF899_FMResponse"]["PAYSLIP_PDF"];

          return resolve(Buffer.from(pdf, "base64"));

        } catch {
          reject("Invalid SAP PDF Response Format");
        }
      });
    });
  });
};
