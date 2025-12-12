const request = require("request");
const xml2js = require("xml2js");

exports.fetchSales = (customerId) => {
    return new Promise((resolve, reject) => {

        const xmlBody = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:urn="urn:sap-com:document:sap:rfc:functions">
            <soapenv:Header/>
            <soapenv:Body>
                <urn:ZCUST_SALES780_FM>
                    <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
                </urn:ZCUST_SALES780_FM>
            </soapenv:Body>
        </soapenv:Envelope>`;

        const options = {
            method: "GET",
            url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_sales1_780ser?sap-client=100",
            headers: {
                "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
                "Content-Type": "text/xml",
                "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
                "Cookie": "sap-usercontext=sap-client=100"
            },
            body: xmlBody
        };

        request(options, (error, response) => {
            if (error) return reject(error);

            console.log("SAP RAW SALES XML:\n", response.body); // DEBUG LOG

            xml2js.parseString(response.body, { explicitArray: false }, (err, result) => {
                if (err) return reject(err);

                try {
                    // WORKING FOR ALL SAP WSDLs
                    const envelope = result["soap-env:Envelope"] 
                                   || result["soapenv:Envelope"]
                                   || result["soap:Envelope"];

                    const body = envelope["soap-env:Body"]
                               || envelope["soapenv:Body"]
                               || envelope["soap:Body"];

                    const responseTag = body["n0:ZCUST_SALES780_FMResponse"]
                                     || body["urn:ZCUST_SALES780_FMResponse"]
                                     || body["ZCUST_SALES780_FMResponse"];

                    const items = responseTag?.ET_SALES_ORDER_LIST?.item;

                    // always return array
                    resolve(Array.isArray(items) ? items : (items ? [items] : []));

                } catch (e) {
                    console.error("SALES PARSE ERROR:", e);
                    resolve([]); // avoid crash
                }
            });
        });
    });
};
