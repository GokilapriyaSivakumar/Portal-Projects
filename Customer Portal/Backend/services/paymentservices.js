const request = require("request");

exports.fetchPaymentList = (customerId) => {
    return new Promise((resolve, reject) => {
        const soapBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:urn="urn:sap-com:document:sap:rfc:functions">
            <soapenv:Header/>
            <soapenv:Body>
                <urn:ZCUST_PAYMENT780_FM>
                    <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
                </urn:ZCUST_PAYMENT780_FM>
            </soapenv:Body>
        </soapenv:Envelope>`;

        const options = {
            method: "GET",
            url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_payment_780ser?sap-client=100",
            headers: {
                "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
                "Content-Type": "text/xml",
                "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
                "Cookie": "sap-usercontext=sap-client=100"
            },
            body: soapBody
        };

        request(options, (error, response) => {
            if (error) return reject(error);
            resolve(response.body); // return SAP XML directly
        });
    });
};
