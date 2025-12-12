// Backend/services/loginservices.js
const axios = require("axios");

async function loginService(customerId, password) {
    const url = "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_login_780ser?sap-client=100";

    const soapBody = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <urn:ZCUSTOMER_LOGIN_780>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
          <IV_PASSWORD>${password}</IV_PASSWORD>
        </urn:ZCUSTOMER_LOGIN_780>
      </soapenv:Body>
    </soapenv:Envelope>
    `;

    const headers = {
        "Content-Type": "text/xml",
        "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
        "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz", // your Basic Auth
        "Cookie": "sap-usercontext=sap-client=100"
    };

    try {
        const response = await axios.post(url, soapBody, { headers });

        return response.data; // raw XML
    } catch (err) {
        console.error("SOAP Error:", err.message);
        throw err;
    }
}

module.exports = { loginService };
