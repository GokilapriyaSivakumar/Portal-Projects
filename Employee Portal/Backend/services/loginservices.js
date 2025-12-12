// Backend/services/loginservices.js
const request = require("request");

const loginService = (empId, password) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZEMP_LOGIN_780_FM>
            <I_EMP_ID>${empId}</I_EMP_ID>
            <I_PASSWORD>${password}</I_PASSWORD>
          </urn:ZEMP_LOGIN_780_FM>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const options = {
      method: "POST",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_loginservice780?sap-client=100",
      headers: {
        "Content-Type": "text/xml",
        "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
        "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
        "Cookie": "sap-usercontext=sap-client=100"
      },
      body: soapBody,
    };

    request(options, (error, response) => {
      if (error) return reject(error);

      return resolve(response.body);
    });
  });
};

module.exports = { loginService };
