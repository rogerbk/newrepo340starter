const { body } = require("express-validator")
const validate = {}

validate.reviewRules = () => {
  return [
    body("review_rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),

    body("review_text")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Review text must be between 1 and 1000 characters"),
  ]
}

module.exports = validate