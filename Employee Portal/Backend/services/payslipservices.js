// // Backend/services/payslipservices.js
// const request = require("request");

// const payslipService = (empId) => {
//     return new Promise((resolve, reject) => {
//         const soapBody = `
//         <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//                           xmlns:urn="urn:sap-com:document:sap:rfc:functions">
//             <soapenv:Header/>
//             <soapenv:Body>
//                 <urn:ZEMP_PAYSLIP780_FM>
//                     <I_EMP_ID>${empId}</I_EMP_ID>
//                 </urn:ZEMP_PAYSLIP780_FM>
//             </soapenv:Body>
//         </soapenv:Envelope>`;

//         const options = {
//             method: "GET",
//             url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_payslipservice780?sap-client=100",
//             headers: {
//                 "Content-Type": "text/xml",
//                 "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
//                 "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
//                 "Cookie": "sap-usercontext=sap-client=100"
//             },
//             body: soapBody
//         };

//         request(options, (error, response) => {
//             if (error) return reject(error);
//             resolve(response.body);
//         });
//     });
// };

// module.exports = { payslipService };


// Backend/services/payslipservices.js
const request = require("request");
const xml2js = require("xml2js");

exports.fetchPayslipPDF = (empId) => {
  return new Promise((resolve, reject) => {

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZEMP_PAYSLIPPDF780_FM>
            <EMPLOYEE_ID>${empId}</EMPLOYEE_ID>
          </urn:ZEMP_PAYSLIPPDF780_FM>
        </soapenv:Body>
      </soapenv:Envelope>`;

    const options = {
      method: "GET",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_payslippdfservice780?sap-client=100",
      headers: {
        "Content-Type": "text/xml",
        "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
        "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
        "Cookie": "sap-usercontext=sap-client=100",
      },
      body: soapBody,
      encoding: null,    // IMPORTANT: Required for PDF
    };

    request(options, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode !== 200) return reject(new Error(`SOAP Error: ${response.statusCode}`));

      xml2js.parseString(body.toString(), { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        try {
          // Extract base64 from SAP response
          const base64pdf =
            result["soap-env:Envelope"]["soap-env:Body"]
              ["n0:ZEMP_PAYSLIPPDF780_FMResponse"]["PAYSLIP_PDF"];

          if (!base64pdf || base64pdf.trim() === "") {
            return reject("No PDF found in SAP response (PAYSLIP_PDF empty)");
          }

          // Convert Base64 → Buffer
          const pdfBuffer = Buffer.from(base64pdf, "base64");
          resolve(pdfBuffer);

        } catch (e) {
          reject("Error parsing SAP payslip PDF: " + e.message);
        }
      });
    });
  });
};
