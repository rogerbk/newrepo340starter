const pool = require("../database/")


/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* *********************
 *  Get all inventory items and classification_name
 * ***********/
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

  /* *******************
 *  Get inventory item by inventory_id
 * ************* */
  async function getInventoryByInvId(inv_id) {
    try {
      const data = await pool.query(
        "SELECT * FROM public.inventory AS i WHERE i.inv_id = $1",
        [inv_id]
      );
      return data.rows;
    } catch (error) {
      console.error("getvehiclebyid error " + error);
    }
  }

  /* **********************
 *   Check for existing classification name
 * ********************* */
async function checkExistingClass(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const className = await pool.query(sql, [classification_name])
    return className.rowCount
  } catch (error) {
    return error.message
  }
}

  // INVENTORY MANAGEMENT
/* ***************************
 *  Add new classification
 * ************************** */
async function addClass(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Generate classification dropdown
 * ************************** */
async function getClassSelect(selectedId) {
  try {
    const result = await pool.query('SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name');
    const classifications = result.rows;

    let classSelect = '<select name="classification_id" id="classification_id" required>';
    classSelect += '<option value="">Select a Classification</option>';

    classifications.forEach(classification => {
      classSelect += `<option value="${classification.classification_id}"${classification.classification_id == selectedId ? ' selected' : ''}>${classification.classification_name}</option>`;
    });

    classSelect += '</select>';
    return classSelect;
  } catch (error) {
    console.error('Error generating classification dropdown:', error);
    throw error;
  }
}

/* ***************************
 *  Add new vehicle
 * ************************** */
async function addVehicle(
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
) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color, 
        classification_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error executing query: ", error.message);
    throw error;
  }
}

  module.exports = {getClassSelect , addClass, addVehicle, getClassifications, getInventoryByClassificationId, getInventoryByInvId};