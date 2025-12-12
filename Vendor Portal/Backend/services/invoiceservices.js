// services/invoiceservices.js
const request = require("request");
const xml2js = require("xml2js");

const SAP_BASE_URL = "http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VEND780_ODATA_SRV";
const FORM_TABLE_ENDPOINT = "/ZVEND_FORMTABLE780Set";
const PDF_ENDPOINT = "/ZVEND_FORMODATA780Set";

const AUTH_HEADER = "Basic SzkwMTc4MDpQcml5YUAxMjAz";   // your real auth
const SAP_COOKIE = "sap-usercontext=sap-client=100";


// ---------------------------------------------------------------
// 1️⃣ Fetch invoice list by Vendor ID
// ---------------------------------------------------------------
exports.getInvoiceData = (vendorId) => {
  return new Promise((resolve, reject) => {
    const url =
      `${SAP_BASE_URL}${FORM_TABLE_ENDPOINT}?$filter=VendorId eq '${vendorId}'`;

    const options = {
      method: "GET",
      url,
      headers: {
        "Authorization": AUTH_HEADER,
        "Cookie": SAP_COOKIE
      }
    };

    request(options, async (err, response) => {
      if (err) return reject(err);

      const parser = new xml2js.Parser({ explicitArray: false });

      try {
        const parsed = await parser.parseStringPromise(response.body);

        let entries = parsed?.feed?.entry || [];
        if (!Array.isArray(entries)) entries = [entries];

        const list = entries.map((item) => {
          const p = item.content["m:properties"];

          return {
            VendorId: p["d:VendorId"] || "",
            InvoiceNo: p["d:InvoiceNo"],
            InvoiceDate: p["d:InvoiceDate"],
            TotalAmount: p["d:TotalAmount"],
            Currency: p["d:Currency"],
            PaymentTerms: p["d:PaymentTerms"],
            PoNo: p["d:PoNo"],
            PoItem: p["d:PoItem"],
            MaterialNo: p["d:MaterialNo"],
            Description: p["d:Description"],
            Quantity: p["d:Quantity"],
            UnitPrice: p["d:UnitPrice"],
            Unit: p["d:Unit"]
          };
        });

        resolve(list);
      } catch (e) {
        reject("Failed to parse invoice list XML");
      }
    });
  });
};


// ---------------------------------------------------------------
// 2️⃣ Fetch PDF by BELNR
// ---------------------------------------------------------------
exports.getInvoicePdf = (belnr) => {
  return new Promise((resolve, reject) => {
    const url = `${SAP_BASE_URL}${PDF_ENDPOINT}(Belnr='${belnr}')`;

    const options = {
      method: "GET",
      url,
      headers: {
        "Authorization": AUTH_HEADER,
        "Cookie": SAP_COOKIE
      }
    };

    request(options, async (err, response) => {
      if (err) return reject(err);

      const parser = new xml2js.Parser({ explicitArray: false });

      try {
        const parsed = await parser.parseStringPromise(response.body);

        const pdfString =
          parsed?.entry?.content?.["m:properties"]?.["d:PdfString"];

        if (!pdfString) {
          return reject("PdfString not found in SAP response");
        }

        // Convert Base64 → PDF Buffer
        const buffer = Buffer.from(pdfString, "base64");

        resolve(buffer);
      } catch (e) {
        reject("Failed to parse PDF XML response");
      }
    });
  });
};
