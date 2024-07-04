const utilities = require("../utilities");
const accountModel = require("../models/account-model")

/* ************************
*  Deliver login view
* *************************/

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }

async function loginAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
  
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      req.flash(
        "notice",
        "Sorry, there was an error processing the registration."
      );
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }
}

module.exports = { buildLogin, loginAccount }