const request = require("request");

const SAP_URL = "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_del_780ser?sap-client=100";
const AUTH_HEADER = "Basic SzkwMTc4MDpQcml5YUAxMjAz";

exports.getDeliveryList = (customerId) => {
    return new Promise((resolve, reject) => {
        const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:urn="urn:sap-com:document:sap:rfc:functions">
            <soapenv:Header/>
            <soapenv:Body>
                <urn:ZCUST_DEL780_FM>
                    <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
                </urn:ZCUST_DEL780_FM>
            </soapenv:Body>
        </soapenv:Envelope>`;

        const options = {
            method: "GET",
            url: SAP_URL,
            headers: {
                "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
                "Content-Type": "text/xml",
                "Authorization": AUTH_HEADER
            },
            body: xmlBody
        };

        request(options, (error, response) => {
            if (error) return reject(error);
            resolve(response.body);
        });
    });
};
