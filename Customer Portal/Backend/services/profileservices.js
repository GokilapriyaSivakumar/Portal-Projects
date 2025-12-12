const request = require("request");

const getCustomerProfile = (customerNumber) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_profile_780ser?sap-client=100",
      headers: {
        "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
        "Content-Type": "text/xml",
        "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz", // replace with your auth
        "Cookie": "sap-usercontext=sap-client=100",
      },
      body: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
               <soapenv:Header/>
               <soapenv:Body>
                  <urn:ZCUSTOMER_PROFILE_780>
                     <IV_KUNNR>${customerNumber}</IV_KUNNR>
                  </urn:ZCUSTOMER_PROFILE_780>
               </soapenv:Body>
             </soapenv:Envelope>`,
    };

    request(options, function (error, response) {
      if (error) {
        return reject(error);
      }

      // Simple XML parsing using regex (for small responses)
      const body = response.body;
      const customerMatch = body.match(/<CUSTOMER_NUMBER>(.*?)<\/CUSTOMER_NUMBER>/);
      const nameMatch = body.match(/<NAME>(.*?)<\/NAME>/);
      const cityMatch = body.match(/<CITY>(.*?)<\/CITY>/);
      const countryMatch = body.match(/<COUNTRY>(.*?)<\/COUNTRY>/);
      const postalMatch = body.match(/<POSTAL>(.*?)<\/POSTAL>/);

      const profile = {
        CUSTOMER_NUMBER: customerMatch ? customerMatch[1] : "",
        NAME: nameMatch ? nameMatch[1] : "",
        CITY: cityMatch ? cityMatch[1] : "",
        COUNTRY: countryMatch ? countryMatch[1] : "",
        POSTAL: postalMatch ? postalMatch[1] : "",
      };

      resolve(profile);
    });
  });
};

module.exports = { getCustomerProfile };
