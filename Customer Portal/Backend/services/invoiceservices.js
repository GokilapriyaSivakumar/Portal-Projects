const request = require("request");
const xml2js = require("xml2js");

/* ======================================================
   FETCH INVOICE LIST (POST)
====================================================== */
exports.fetchInvoiceList = (customerId) => {
    return new Promise((resolve, reject) => {

        const soapBody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:Z780_INVOICE_FM>
         <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
      </urn:Z780_INVOICE_FM>
   </soapenv:Body>
</soapenv:Envelope>`;

        const options = {
            method: "POST",
            url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_invoice_780ser?sap-client=100",
            headers: {
                "Content-Type": "text/xml",
                "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
                "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
            },
            body: soapBody
        };

        request(options, (error, response, body) => {
            if (error) return reject(error);

            xml2js.parseString(body, { explicitArray: false }, (err, parsed) => {
                if (err) return reject(err);

                try {
                    const items =
                        parsed["soap-env:Envelope"]["soap-env:Body"]["n0:Z780_INVOICE_FMResponse"]["E_INVOICE"]["item"];

                    resolve(Array.isArray(items) ? items : [items]);

                } catch (e) {
                    reject("Invalid SAP response format");
                }
            });
        });
    });
};

/* ======================================================
   FETCH PDF FOR SPECIFIC VBELN (POST)
====================================================== */
exports.fetchInvoicePDF = (vbeln) => {
    return new Promise((resolve, reject) => {

        const soapBody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:Z780_INVOICEDATA_FM>
         <P_VBELN>${vbeln}</P_VBELN>
      </urn:Z780_INVOICEDATA_FM>
   </soapenv:Body>
</soapenv:Envelope>`;

        const options = {
            method: "POST",
            url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zcustomer_invoicedata_780ser?sap-client=100",
            headers: {
                "Content-Type": "text/xml",
                "SOAPAction": "urn:sap-com:document:sap:rfc:functions",
                "Authorization": "Basic SzkwMTc4MDpQcml5YUAxMjAz",
            },
            body: soapBody
        };

        request(options, (error, response, body) => {
            if (error) return reject(error);

            xml2js.parseString(body, { explicitArray: false }, (err, parsed) => {
                if (err) return reject(err);

                try {
                    const pdfBase64 =
                        parsed["soap-env:Envelope"]["soap-env:Body"]["n0:Z780_INVOICEDATA_FMResponse"]["X_PDF"];

                    if (!pdfBase64 || pdfBase64.trim() === "")
                        return reject("PDF is empty");

                    const buffer = Buffer.from(pdfBase64, "base64");
                    resolve(buffer);

                } catch (e) {
                    reject("Error parsing PDF: " + e);
                }
            });
        });
    });
};
