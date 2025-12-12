const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const loginRoutes = require("./routes/login");
const profileRoutes = require("./routes/profile");
const leaveRoutes = require("./routes/leave");
const payslipRoutes = require("./routes/payslip");
const paydataRoutes = require("./routes/paydata");

const app = express();

// **************** CORS FIX **************** //
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);  // Preflight fix 💥
  }
  next();
});
// ******************************************* //

app.use(bodyParser.json());

// ROUTES
app.use("/api", loginRoutes);
app.use("/api", profileRoutes);
app.use("/api", leaveRoutes);
app.use("/api", payslipRoutes);
app.use("/api", paydataRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
