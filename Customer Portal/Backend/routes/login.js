// Backend/routes/login.js
const express = require("express");
const router = express.Router();
const { loginController } = require("../controllers/logincontrollers");

router.post("", loginController);

module.exports = router;
