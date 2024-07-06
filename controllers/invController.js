const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data.length > 0 ? data[0].classification_name : "No vehicles"
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error in buildByClassificationId:", error)
    next(error)
  }
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const grid = await utilities.buildVehicleGrid(data);
  let nav = await utilities.getNav();
  const vehicleMake = data[0].inv_make;
  const vehicleModel = data[0].inv_model;
  const vehicleYear = data[0].inv_year;
  res.render("./inventory/vehicle", {
    title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
    nav,
    errors: null,
    grid,
  });
};

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classSelect = await utilities.getClassSelect();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classSelect,
  });
};

/* ***************************
 *  Deliver addclass view
 * ************************** */
invCont.buildAddclass = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addclass", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process class info
 * *************************************** */
invCont.addClass = async function (req, res, next) {
  const { classification_name } = req.body;

  const regResult = await invModel.addClass(classification_name);
  let nav = await utilities.getNav();

  if (regResult) {
    req.flash("success", "Classification added");
    res.status(200).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("error", "Class addition failed");
    res.status(501).render("./inventory/addclass", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ***************************
 *  Deliver addvehicle view
 * ************************** */
invCont.buildAddvehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classSelect = await utilities.getClassSelect();
  res.render("./inventory/addvehicle", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classSelect,
  });
};

/* ****************************************
 *  Process vehicle info
 * *************************************** */
invCont.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classSelect = await utilities.getClassSelect();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const regResult = await invModel.addVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (regResult) {
    req.flash("success", "Vehicle added");
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } else {
    req.flash("error", "Vehicle addition failed");
    res.status(501).render("./inventory/addclass", {
      title: "Add Vehicle",
      nav,
      classSelect,
    });
  }
};

module.exports = invCont