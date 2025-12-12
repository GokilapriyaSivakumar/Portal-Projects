// Backend/services/inquiryservices.js
const axios = require("axios");

async function inquiryService(customerId) {
    const url = "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_inquiry_780ser?sap-client=100";

    const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZCUST_INQUIRY780_FM>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        </urn:ZCUST_INQUIRY780_FM>
      </soapenv:Body>
    </soapenv:Envelope>
    `;

    const headers = {
        "Content-Type": "text/xml",
        "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
        "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
        "Cookie": "sap-usercontext=sap-client=100"
    };

    try {
        const response = await axios.post(url, soapBody, { headers });
        return response.data; // raw XML
    } catch (err) {
        console.log("SAP RESPONSE XML:", response.data);
        return response.data;

    }
}

module.exports = { inquiryService };
