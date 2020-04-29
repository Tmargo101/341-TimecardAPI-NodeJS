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

// GET a department from company (WORKING)
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
      return response.status(404).json({"error":"Could not get department '" + inDeptId +  "''."});
   }
});

// POST a new department to company (WORKING)
router.post("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("Received POST for '/departments'");

   // Get variables from body
   let inCompany = request.body.company;
   let inDeptName = request.body.dept_name;
   let inDeptNo = "txm5483-" + request.body.dept_no;
   let inLocation = request.body.location;

   // If all query variables are not null
   if (inCompany && inDeptName && inDeptNo && inLocation) {

      try {
         // Check if there is a duplicate department in company
         if (JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes(inDeptNo)) {
            console.log("Error with POST: Duplicate Department in company.");
            return response.status(404).json({error:"Duplicate department number in company " + inCompany + "."})
         }
         // Create new department object to insert & insert into data layer
         let newDepartment = new dataLayer.Department(inCompany, inDeptName, inDeptNo, inLocation);
         let insertedDepartment = dataLayer.insertDepartment(newDepartment);

         // If insertedDepartment is null
         if (!insertedDepartment) {
            console.log("Error with POST: Did not insert department.");
            return response.status(404).json({error:"Did not insert department."});
         }
         // Return inserted department
         return response.status(200).json({success:insertedDepartment});

      } catch(error) {
         console.error("Error inserting department: " + error);
         return response.status(404).json({error:"Could not get departments."});
      } // End catch

   } else {
      // If all fields in query are NOT filled out
      return response.status(404).json({error:"Not all fields are filled out."});
   }
});

// Update a department
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

   if (inCompany && inDeptName && inDeptNo && inLocation && inDeptId) {
      // Try to post stuff to data layer
      try {

         // Check if Department ID exists in Company
         if (!JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes(inDeptId)) {
            console.log("Error with POST: Department ID does not exist.");
            return response.status(404).json({error:"Department with dept_id '" + inDeptId + "' does not exist in " + inCompany + "."})
         }

         // Check if there is a Duplicate department in company
         if (JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes(inDeptNo)) {
            console.log("Error with POST: Duplicate Department in company.");
            return response.status(404).json({error:"There is a department with dept_no '" + inDeptNo + "' in company " + inCompany + "."})
         }

         // Create new department object to insert & insert into data layer
         let newDepartment = new dataLayer.Department(inCompany, inDeptName, inDeptNo, inLocation, inDeptId);
         console.log(newDepartment);
         let updatedDepartment = dataLayer.updateDepartment(newDepartment);

         // If updatedDepartment is null
         if (!updatedDepartment) {
            return response.status(404).json({error:"Did not update department."})
         }
         // Return successful
         return response.status(200).json({success:updatedDepartment});

      } catch(error) {
         console.error("Error updating departments: " + error);
         return response.status(404).json({error:"Could not update departments."});
      }
   } else {
      return response.status(404).json({error:"Not all fields are filled out."});
   }
});

// Delete a department
router.delete("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("Received DELETE for '/department'");

   // Get variables from query
   let inCompany = request.query.company;
   let inDeptId = request.query.dept_id;

   // Try to delete stuff from data layer
   try {
      let formerDepartment = dataLayer.deleteDepartment(inCompany, inDeptId);
      return response.status(200).json({success:"Department " + inDeptId + " from " + inCompany + " deleted."});
   } catch(error) {
      console.error("Error deleting department ''" + inDeptId + "'': " + error);
      return response.status(404).json({"error":"Could not delete department ''" + inDeptId + "''."});
   }
});



// Allows server.js to see the department router
module.exports = router;
