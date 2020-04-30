let express = require('express');
let router = express.Router();

let dataLayer = require("./companydata/index.js");


// GET a timecard from company
router.get("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("Received GET for '/timecard'");

   // Get variables from query
   let inCompany = request.query.company;
   let inTimecardId = request.query.timecard_id;

   // Try to get stuff from data layer
   try {
      let timecard = dataLayer.getTimecard(inCompany, inTimecardId);
      return response.status(200).json(timecard);
   } catch(error) {
      console.error("Error getting timecard: " + error);
      return response.status(404).json({"error":"Could not get timecard '" + inTimecardId +  "''."});
   }
});


// POST a new department to company
router.post("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("Received POST for '/departments'");

   // Get variables from body
   let inCompany = request.body.company;
   let inTimecardName = request.body.emp_name;
   let inTimecardNo = "txm5483-" + request.body.emp_no;
   let inHireDate = request.body.hire_date;
   let inJob = request.body.job;
   let inSalary = request.body.salary;
   let inDeptId = request.body.dept_id;
   let inManagerId = request.body.mng_id;

   // If all query variables are not null
   if (inCompany && inTimecardName && inTimecardNo && inHireDate && inJob && inSalary && inDeptId && inManagerId) {

      try {
         // Validations

         // Check if company name is txm5483
         if (inCompany != "txm5483") {
            console.log("Error with POST: company does not match.");
            return response.status(404).json({error:"Company does not match '" + inCompany + "'."})
         }

         // Check if there is a department in company
         if (!JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes("{" + inDeptNo + "}")) {
            console.log("Error with POST: Department does not exist.");
            return response.status(404).json({error:"Department does not exist in company " + inCompany + "."})
         }

         // // Check if there is a department in company
         // if (!JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes("{" + inDeptNo + "}")) {
         //    console.log("Error with POST: Department does not exist.");
         //    return response.status(404).json({error:"Department does not exist in company " + inCompany + "."})
         // }

         // Check if


         // Create new timecard object to insert & insert into data layer
         let newTimecard = new dataLayer.Timecard(inTimecardName, inTimecardNo, inHireDate, inJob, inSalary, inDeptId, inManagerId);
         let insertedTimecard = dataLayer.insertTimecard(newTimecard);

         // If insertedTimecard is null
         if (!insertedTimecard) {
            console.log("Error with POST: Did not insert timecard.");
            return response.status(404).json({error:"Did not insert timecard."});
         }

         // Return inserted timecard
         return response.status(200).json({success:insertedTimecard});

      } catch(error) {
         console.error("Error inserting timecard: " + error);
         return response.status(404).json({error:"Could not get timecard."});
      } // End catch

   } else {
      // If all fields in query are NOT filled out
      return response.status(404).json({error:"Not all fields are filled out."});
   }
});


// Update a department
router.put("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("Received PUT for '/timecard'");
   console.log(request.body);

   // Get variables from body
   let inCompany = request.body.company;
   let inTimecardId = request.body.emp_id
   let inTimecardName = request.body.emp_name;
   let inTimecardNo = request.body.emp_no;
   let inHireDate = request.body.hire_date;
   let inJob = request.body.job;
   let inSalary = request.body.salary;
   let inDeptId = request.body.dept_id;
   let inManagerId = request.body.mng_id;

   if (inCompany && inDeptName && inDeptNo && inLocation && inDeptId) {
      // Try to post stuff to data layer
      try {

         // // Check if Department ID exists in Company
         // if (!JSON.stringify(dataLayer.getAllTimecard(inCompany)).includes(inDeptId)) {
         //    console.log("Error with POST: Department ID does not exist.");
         //    return response.status(404).json({error:"Department with dept_id '" + inDeptId + "' does not exist in " + inCompany + "."})
         // }
         //
         // // Check if there is a Duplicate department in company
         // if (JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes(inDeptNo)) {
         //    console.log("Error with POST: Duplicate Department in company.");
         //    return response.status(404).json({error:"There is a department with dept_no '" + inDeptNo + "' in company " + inCompany + "."})
         // }

         // Create new department object to insert & insert into data layer
         let newTimecard = new dataLayer.Timecard(inTimecardName, inTimecardNo, inHireDate, inJob, inSalary, inDeptId, inManagerId);
         let updatedTimecard = dataLayer.updateTimecard(newTimecard);

         // If updatedDepartment is null
         if (!updatedTimecard) {
            return response.status(404).json({error:"Did not update timecard."})
         }
         // Return successful
         return response.status(200).json({success:updatedTimecard});

      } catch(error) {
         console.error("Error updating timecard: " + error);
         return response.status(404).json({error:"Could not update timecard."});
      }
   } else {
      return response.status(404).json({error:"Not all fields are filled out."});
   }
});


// Delete an timecard
router.delete("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("Received DELETE for '/timecard'");

   // Get variables from query
   let inCompany = request.query.company;
   let inTimecardId = request.query.emp_id;

   // Try to delete stuff from data layer
   try {
      let formerTimecard = dataLayer.deleteTimecard(inCompany, inTimecardId);
      return response.status(200).json({success:"Timecard " + inTimecardId + " from " + inCompany + " deleted."});
   } catch(error) {
      console.error("Error deleting timecard ''" + inTimecardId + "'': " + error);
      return response.status(404).json({"error":"Could not delete timecard ''" + inTimecardId + "''."});
   }
});


// Allows server.js to see the timecard router
module.exports = router;
