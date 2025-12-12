// index.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const loginRoute = require("./routes/login");
const profileRoute = require("./routes/profile");
const creditDebitRoute = require("./routes/creditdebit");
const rfqRoute = require("./routes/rfq");
const grRoute = require("./routes/gr");
const paymentRoute = require("./routes/payment");
const poRoute = require("./routes/po");
const invoiceRoute = require("./routes/invoice");   // <-- NEW

const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Vendor routes
app.use("/api/vendor", loginRoute);
app.use("/api/vendor", profileRoute);
app.use("/api/vendor", creditDebitRoute);
app.use("/api/vendor", rfqRoute);
app.use("/api/vendor", grRoute);
app.use("/api/vendor", paymentRoute);
app.use("/api/vendor", poRoute);
app.use("/api/vendor", invoiceRoute);                 // <-- NEW

app.get("/", (req, res) => {
  res.send("Vendor API Running (Login, Profile, CreditDebit, RFQ, GR, Payment, PO, Invoice)");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
