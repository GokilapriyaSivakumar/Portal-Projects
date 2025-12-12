// Backend/routes/login.js
const express = require("express");
const { loginController } = require("../controllers/logincontrollers");
const router = express.Router();

router.post("/login", loginController);

module.exports = router;