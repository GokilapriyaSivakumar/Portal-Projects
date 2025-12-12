// services/overallsalesservices.js

const request = require("request");
const xml2js = require("xml2js");

exports.fetchOverallSales = (customerId) => {
    return new Promise((resolve, reject) => {

        const xmlBody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZCUST_OVERALLSALES780_FM>
         <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </urn:ZCUST_OVERALLSALES780_FM>
   </soapenv:Body>
</soapenv:Envelope>`;

        const options = {
            method: "GET",
            url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_oversales_780ser?sap-client=100",
            headers: {
                "Content-Type": "text/xml",
                "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
                "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
                "Cookie": "sap-usercontext=sap-client=100"
            },
            body: xmlBody
        };

        request(options, (error, response) => {
            if (error) {
                console.error("SAP Request Error:", error);
                return reject(error);
            }

            xml2js.parseString(response.body, { explicitArray: false }, (err, result) => {
                if (err) {
                    console.error("XML Parse Error:", err);
                    return reject(err);
                }

                try {
                    const sales =
                        result["soap-env:Envelope"]["soap-env:Body"]
                            ["n0:ZCUST_OVERALLSALES780_FMResponse"]
                            ["ET_OVERALL_SALES"]["item"];

                    const cleanArray = Array.isArray(sales) ? sales : [sales];

                    resolve({ ET_OVERALL_SALES: cleanArray });

                } catch (e) {
                    console.error("Parsing Path Error:", e);
                    resolve({ ET_OVERALL_SALES: [] });
                }
            });
        });
    });
};
