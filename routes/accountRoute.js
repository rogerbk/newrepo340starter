const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const { handleErrors } = require("../utilities")
const regValidate = require('../utilities/account-validation')
const Util = require("../utilities"); 

router.get("/", Util.checkLogin, handleErrors(accountController.buildAccount));

// Route to build default account view
router.get("/account", Util.checkLogin, handleErrors(accountController.buildAccount));

// deliver login view
router.get("/login", handleErrors(accountController.buildLogin));

// process login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  handleErrors(accountController.accountLogin)
)

// deliver registration view
router.get("/register", handleErrors(accountController.buildRegister))

// process registration
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    handleErrors(accountController.registerAccount)
  )
module.exports = router