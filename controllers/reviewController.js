const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewController = {}

reviewController.buildReviewForm = async function (req, res, next) {
    try {
      const inv_id = parseInt(req.params.inv_id)
      let nav = await utilities.getNav()
      const vehicleData = await invModel.getInventoryByInvId(inv_id)
      
      if (!vehicleData || vehicleData.length === 0) {
        req.flash("notice", "Vehicle not found.")
        return res.redirect("/inv")
      }
  
      res.render("./reviews/add-review", {
        title: "Add Review",
        nav,
        errors: null,
        inv_id,
        vehicle: vehicleData[0]
      })
    } catch (error) {
      console.error("Error in buildReviewForm:", error)
      next(error)
    }
  }

  reviewController.addReview = async function (req, res, next) {
    try {
      const { inv_id, review_rating, review_text } = req.body
      const account_id = res.locals.accountData.account_id
      
      const addResult = await reviewModel.addReview(inv_id, account_id, review_rating, review_text)
      
      if (addResult) {
        req.flash("notice", "Review added successfully")
        res.redirect(`/inv/detail/${inv_id}`)
      } else {
        req.flash("notice", "Error adding review")
        res.status(501).render("reviews/add-review", {
          title: "Add Review",
          nav: await utilities.getNav(),
          errors: null,
          inv_id,
        })
      }
    } catch (error) {
      console.error("Error in addReview:", error)
      next(error)
    }
  }

reviewController.buildEditReviewForm = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)
  
  res.render("./reviews/edit-review", {
    title: "Edit Review",
    nav,
    errors: null,
    review: reviewData
  })
}

reviewController.updateReview = async function (req, res, next) {
  const { review_id, review_rating, review_text } = req.body
  
  const updateResult = await reviewModel.updateReview(review_id, review_rating, review_text)
  
  if (updateResult) {
    req.flash("notice", "Review updated successfully")
    res.redirect(`/account/`)
  } else {
    req.flash("notice", "Error updating review")
    res.status(501).render("reviews/edit-review", {
      title: "Edit Review",
      nav,
      errors: null,
      review: { review_id, review_rating, review_text }
    })
  }
}

reviewController.deleteReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  
  const deleteResult = await reviewModel.deleteReview(review_id)
  
  if (deleteResult) {
    req.flash("notice", "Review deleted successfully")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Error deleting review")
    res.redirect("/account/")
  }
}

module.exports = reviewController