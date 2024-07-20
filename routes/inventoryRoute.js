// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const reviewController = require("../controllers/reviewController")
const invValidate = require("../utilities/inventory-validation")
const reviewValidate = require("../utilities/review-validation")
const { handleErrors, checkLogin, checkEmployeeAdmin } = require("../utilities")

router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:invId", handleErrors(invController.buildByInvId))

// Routes that require employee/admin access
router.get("/", checkEmployeeAdmin, handleErrors(invController.buildManagementView))
router.get("/getInventory/:classification_id", checkEmployeeAdmin, handleErrors(invController.getInventoryJSON))
router.get("/addclass", checkEmployeeAdmin, handleErrors(invController.buildAddclass))
router.get("/addvehicle", checkEmployeeAdmin, handleErrors(invController.buildAddvehicle))
router.post("/addclass", checkEmployeeAdmin, invValidate.classRules(), invValidate.checkClassData, handleErrors(invController.addClass))
router.post("/addvehicle", checkEmployeeAdmin, invValidate.vehicleRules(), invValidate.checkVehicleData, handleErrors(invController.addVehicle))
router.post("/update", checkEmployeeAdmin, invValidate.vehicleRules(), invValidate.checkVehicleData, handleErrors(invController.updateVehicle))
router.get("/edit/:inv_id", checkEmployeeAdmin, handleErrors(invController.buildVehicleEdit))
router.get("/delete/:inv_id", checkEmployeeAdmin, handleErrors(invController.buildVehicleDeleteConfirm))
router.post("/delete", checkEmployeeAdmin, handleErrors(invController.deleteVehicle))

// Review routes
router.get("/review/add/:inv_id", checkLogin, handleErrors(reviewController.buildReviewForm))
router.post("/review/add", checkLogin, reviewValidate.reviewRules(), handleErrors(reviewController.addReview))
router.get("/review/edit/:review_id", checkLogin, handleErrors(reviewController.buildEditReviewForm))
router.post("/review/update", checkLogin, reviewValidate.reviewRules(), handleErrors(reviewController.updateReview))
router.get("/review/delete/:review_id", checkLogin, handleErrors(reviewController.deleteReview))

module.exports = router