// Backend/services/profileservices.js
const request = require("request");

const profileService = (empId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZEMP_PROFILE780_FM>
             <I_EMP_ID>${empId}</I_EMP_ID>
          </urn:ZEMP_PROFILE780_FM>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const options = {
      method: "GET",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_profileservice780?sap-client=100",
      headers: {
        "Content-Type": "text/xml",
        "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
        "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
        "Cookie": "sap-usercontext=sap-client=100"
      },
      body: soapBody
    };

    request(options, (error, response) => {
      if (error) return reject(error);

      return resolve(response.body);
    });
  });
};

module.exports = { profileService };
