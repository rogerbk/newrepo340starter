const pool = require("../database/")

async function getAccountByEmail(account_email) {
    try {
      const result = await pool.query(
        "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
        [account_email]
      );
      return result.rows[0];
    } catch (error) {
      return new Error("No matching email found");
    }
  }

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    return result.rows[0]
  } catch (error) {
    console.error("Error in registerAccount:", error)
    return null
  }
}

module.exports = { getAccountByEmail, registerAccount }