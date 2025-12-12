// routes/login.js
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/logincontrollers");

router.post("/login", loginController.Login);

module.exports = router;
