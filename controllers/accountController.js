const utilities = require("../utilities");
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
*  Deliver login view
************************* */
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

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
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

  const regResult = await accountModel.loginAccount(
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash("success", "You're logged in!");
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("error", "Login failed.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

/* ************************
*  Deliver registration view
************************* */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      res.cookie("jwt", accessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: 3600 * 1000 
      });
      return res.redirect("/account/"); 
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Error in accountLogin:", error);
    req.flash("notice", "An error occurred during login.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}

async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData;
  
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    accountData
  });
}

async function buildAccountUpdate(req, res, next) {
  const accountId = parseInt(req.params.accountId)
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  if (accountId !== accountData.account_id) {
    req.flash("notice", "You don't have permission to update this account.")
    return res.redirect("/account/")
  }

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    accountData
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const accountData = await accountModel.getAccountById(account_id)

  if (account_id != res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to update this account.")
    return res.redirect("/account/")
  }

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const updatedAccountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "The account information has been updated.")
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccountData
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: { ...accountData, account_firstname, account_lastname, account_email }
    })
  }
}

async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  if (account_id != res.locals.accountData.account_id) {
    req.flash("notice", "You don't have permission to change this account's password.")
    return res.redirect("/account/")
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: res.locals.accountData
    })
    return
  }

  const changeResult = await accountModel.changePassword(hashedPassword, account_id)

  if (changeResult) {
    const updatedAccountData = await accountModel.getAccountById(account_id)
    req.flash("notice", "The password has been updated.")
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccountData
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: res.locals.accountData
    })
  }
}

/* ****************************************
*  Process logout
* *************************************** */
async function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = { logoutAccount, changePassword,updateAccount,buildAccountUpdate, buildAccount, accountLogin, buildLogin, buildRegister, registerAccount, loginAccount }