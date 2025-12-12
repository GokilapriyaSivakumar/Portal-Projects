const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const loginRoutes = require("./routes/login");
const inquiryRoutes = require("./routes/inquiry");
const profileRoutes = require("./routes/profile");
const salesRoutes = require("./routes/sales");
const deliveryRoutes = require("./routes/delivery");
const creditDebitRoutes = require("./routes/creditdebit");
const paymentRoutes = require("./routes/payment");
const overallsalesRoutes = require("./routes/overallsales");
const invoiceRoutes = require("./routes/invoice");

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(bodyParser.json());

app.use("/api/login", loginRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/creditdebit", creditDebitRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/overallsales", overallsalesRoutes);
app.use("/api/invoice", invoiceRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
