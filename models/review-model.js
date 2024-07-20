const pool = require("../database/")

const reviewModel = {}

reviewModel.addReview = async function(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = "INSERT INTO vehicle_reviews (inv_id, account_id, review_rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *"
    const result = await pool.query(sql, [inv_id, account_id, review_rating, review_text])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error " + error)
    return null
  }
}

reviewModel.getReviewsByVehicle = async function(inv_id) {
  try {
    const sql = "SELECT r.*, a.account_firstname, a.account_lastname FROM vehicle_reviews r JOIN account a ON r.account_id = a.account_id WHERE r.inv_id = $1 ORDER BY r.review_date DESC"
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByVehicle error " + error)
    return []
  }
}

reviewModel.getReviewsByUser = async function(account_id) {
  try {
    const sql = "SELECT r.*, i.inv_make, i.inv_model FROM vehicle_reviews r JOIN inventory i ON r.inv_id = i.inv_id WHERE r.account_id = $1 ORDER BY r.review_date DESC"
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByUser error " + error)
    return []
  }
}

reviewModel.updateReview = async function(review_id, review_rating, review_text) {
  try {
    const sql = "UPDATE vehicle_reviews SET review_rating = $1, review_text = $2 WHERE review_id = $3 RETURNING *"
    const result = await pool.query(sql, [review_rating, review_text, review_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateReview error " + error)
    return null
  }
}

reviewModel.deleteReview = async function(review_id) {
  try {
    const sql = "DELETE FROM vehicle_reviews WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rowCount
  } catch (error) {
    console.error("deleteReview error " + error)
    return 0
  }
}

module.exports = reviewModel