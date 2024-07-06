const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const { handleErrors } = require("../utilities")
const regValidate = require('../utilities/account-validation')
const Util = require("../utilities"); 

// deliver login view
router.get("/login", handleErrors(accountController.buildLogin));

// deliver registration view
router.get("/register", handleErrors(accountController.buildRegister))

// process registration
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    handleErrors(accountController.registerAccount)
  )
// process login
router.post('/login', handleErrors(accountController.loginAccount))

module.exports = router