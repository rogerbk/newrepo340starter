const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const { handleErrors, checkLogin } = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build default account view
router.get("/", checkLogin, handleErrors(accountController.buildAccount))

// Deliver login view
router.get("/login", handleErrors(accountController.buildLogin))

// Process login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  handleErrors(accountController.accountLogin)
)

// Deliver registration view
router.get("/register", handleErrors(accountController.buildRegister))

// Process registration
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  handleErrors(accountController.registerAccount)
)

// Deliver account update view
router.get("/update/:accountId", checkLogin, handleErrors(accountController.buildAccountUpdate))

// Process account update
router.post(
  "/update",
  checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/change-password",
  checkLogin,
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  handleErrors(accountController.changePassword)
)

// Logout route
router.get("/logout", handleErrors(accountController.logoutAccount))

module.exports = router