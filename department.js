// Tom Margosian
// ISTE-341 Project 3

// //MOMENT.js
// let moment = require("moment");
// moment(new Date()).isValid();  // Will tell you if valid moment
// moment('2010-10-20').isSameOrBefore('2010-10-21');  // true
// moment('2010-10-20').isSameOrBefore('2010-10-20');  // true
// moment('2010-10-20').isSameOrBefore('2010-10-19');  // false


let express = require('express');
let router = express.Router();

let DataLayer = require("./companydata");

// GET all departments from company (WORKING)
router.get("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("Received GET for '/department'");

   // Get variables from query
   let inCompany = request.query.company;
   let inDeptId = request.query.dept_id;
   // Try to get stuff from data layer
   try {
      let departments = dataLayer.getDepartment(inCompany, inDeptId);
      return response.status(200).json(departments);
   } catch(error) {
      console.error("Error getting departments: " + error);
      return response.status(404).json({"error":"Could not get departments."});
   }
});

// POST a new department to company (WORKING)
router.post("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("Received POST for '/departments'");

   // Get variables from body
   let inCompany = request.body.company;
   let inDeptName = request.body.dept_name;
   let inDeptNo = request.body.dept_no;
   let inLocation = request.body.location;

   // Try to post stuff to data layer
   try {
      // Create new department object to insert & insert into data layer
      let newDepartment = new dataLayer.Department(inCompany, inDeptName, inDeptNo, inLocation);
      let insertedDepartment = dataLayer.insertDepartment(newDepartment);

      // If insertedDepartment is null
      if (!insertedDepartment) {
         return response.status(404).json({error:"Did not insert department."});
      }
      // Return
      return response.status(200).json(insertedDepartment);

   } catch(error) {
      console.error("Error inserting departments: " + error);
      return response.status(404).json({error:"Could not get departments."});
   }
});

router.put("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("Received PUT for '/departments'");
   console.log(request.body);

   // Get variables from body
   let inCompany = request.body.company;
   let inDeptName = request.body.dept_name;
   let inDeptNo = request.body.dept_no;
   let inLocation = request.body.location;
   let inDeptId = request.body.dept_id;

   // Try to post stuff to data layer
   try {
      // Create new department object to insert & insert into data layer
      let newDepartment = new dataLayer.Department(inCompany, inDeptName, inDeptNo, inLocation, inDeptId);
      console.log(newDepartment);
      let updatedDepartment = dataLayer.updateDepartment(newDepartment);

      // If updatedDepartment is null
      if (!updatedDepartment) {
         return response.status(404).json({error:"Did not update department."})
      }
      // Return
      return response.status(200).json(updatedDepartment);

   } catch(error) {
      console.error("Error updating departments: " + error);
      return response.status(404).json({error:"Could not get departments."});
   }
});


// Allows server.js to see the department router
module.exports = router;
