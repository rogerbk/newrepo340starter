const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const { handleErrors } = require("../utilities")
const Util = require("../utilities"); 

// deliver login view
router.get("/login", handleErrors(accountController.buildLogin));

module.exports = router