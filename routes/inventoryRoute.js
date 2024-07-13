// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")
const { handleErrors, checkEmployeeAdmin } = require("../utilities");

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", handleErrors(invController.buildByInvId));

// Routes that require employee/admin access
router.get("/", checkEmployeeAdmin, handleErrors(invController.buildManagementView));

router.get("/getInventory/:classification_id", checkEmployeeAdmin, handleErrors(invController.getInventoryJSON));

router.get("/addclass", checkEmployeeAdmin, handleErrors(invController.buildAddclass));

router.get("/addvehicle", checkEmployeeAdmin, handleErrors(invController.buildAddvehicle));

router.post("/addclass", checkEmployeeAdmin, invValidate.classRules(), invValidate.checkClassData, handleErrors(invController.addClass));

router.post("/addvehicle", checkEmployeeAdmin, invValidate.vehicleRules(), invValidate.checkVehicleData, handleErrors(invController.addVehicle));

router.post("/update", checkEmployeeAdmin, invValidate.vehicleRules(), invValidate.checkVehicleData, handleErrors(invController.updateVehicle));

router.get("/edit/:inv_id", checkEmployeeAdmin, handleErrors(invController.buildVehicleEdit));

router.get("/delete/:inv_id", checkEmployeeAdmin, handleErrors(invController.buildVehicleDeleteConfirm));

router.post("/delete", checkEmployeeAdmin, handleErrors(invController.deleteVehicle));

module.exports = router;