// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")
const { handleErrors, } = require("../utilities");

// Build inventory management table inventory view
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
  );
  
  router.get("/", handleErrors(invController.buildManagementView));
  
  // Route to build add classification view
  router.get("/addclass", handleErrors(invController.buildAddclass));
  
  // Route to build add vehicle view
  router.get("/addvehicle", handleErrors(invController.buildAddvehicle));
  
  // Process the new classification data
  router.post(
    "/addclass",
    invValidate.classRules(),
    invValidate.checkClassData,
    handleErrors(invController.addClass)
  );
  
  // Process the new vehicle data
  router.post(
    "/addvehicle",
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    handleErrors(invController.addVehicle)
  );

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory by vehicle view
router.get("/detail/:invId", handleErrors(invController.buildByInvId));

module.exports = router;