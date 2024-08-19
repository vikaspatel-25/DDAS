const express = require('express');
const router = express.Router();
const {reqHandler} = require("../controllers/reqresHandler")

router.route("/checkDuplicateFile")
.post(reqHandler)

module.exports = router