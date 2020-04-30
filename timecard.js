let express = require('express');
let router = express.Router();

let DataLayer = require("./companydata/index.js");

// Import moment for date validation
let moment = require("moment");


// GET a timecard from company
router.get("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received GET for '/timecard'");

   // Get variables from query
   let inCompany = request.query.company;
   let inTimecardId = request.query.timecard_id;

   // Try to get stuff from data layer
   try {
      let timecard = dataLayer.getTimecard(inTimecardId);
      if (timecard) {
         return response.status(200).json(timecard);
      }
      return response.status(404).json({"error":"No timecard found for timecard_id '" + inTimecardId +  "''."});
   } catch(error) {
      console.error("Error getting timecard: " + error);
      return response.status(404).json({"error":"Could not get timecard '" + inTimecardId +  "''."});
   }
});


// POST a new tiemcard to company
router.post("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received POST for '/timecard'");

   // Get variables from body
   let inCompany = request.body.company;
   let inEmployeeId = request.body.emp_id;
   let inStartTime = moment( request.body.start_time).format("YYYY-MM-DD hh:mm:ss");
   let inEndTime = moment( request.body.end_time).format("YYYY-MM-DD hh:mm:ss");;

   // If all query variables are not null
   if (inCompany && inEmployeeId && inStartTime && inEndTime) {

      try {
         // Validations

         // Check if company name is txm5483
         if (inCompany != "txm5483") {
            console.log("Error with POST: company does not match.");
            return response.status(404).json({error:"Company does not match '" + inCompany + "'."})
         }

         // Check if there is a employee in company
         if (!JSON.stringify(dataLayer.getAllEmployee(inCompany)).includes(inEmployeeId)) {
            console.log("Error with POST: Employee does not exist.");
            return response.status(404).json({error:"Employee does not exist in company " + inCompany + "."})
         }

         // moment(dateObj).format("YYYY-MM-DD hh:mm:ss"); 

         // // Check if there is a department in company
         // if (!JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes("{" + inDeptNo + "}")) {
         //    console.log("Error with POST: Department does not exist.");
         //    return response.status(404).json({error:"Department does not exist in company " + inCompany + "."})
         // }

         // Create new timecard object to insert & insert into data layer
         let newTimecard = new dataLayer.Timecard(inStartTime, inEndTime, inEmployeeId);
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


// Update a timecard
router.put("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received PUT for '/timecard'");
   // console.log(request.body);

   // Get variables from body
   let inCompany = request.body.company;
   let inEmployeeId = request.body.emp_id;
   let inStartTime = moment( request.body.start_time).format("YYYY-MM-DD hh:mm:ss");
   let inEndTime = moment( request.body.end_time).format("YYYY-MM-DD hh:mm:ss");
   let inTimecardId = request.body.timecard_id;

   if (inCompany && inEmployeeId && inStartTime && inEndTime && inTimecardId) {
      // Try to post stuff to data layer
      try {

         // Check if company name is txm5483
         if (inCompany != "txm5483") {
            console.log("Error with POST: company does not match.");
            return response.status(404).json({error:"Company does not match '" + inCompany + "'."})
         }

         // Check if there is a employee in company
         if (!JSON.stringify(dataLayer.getAllEmployee(inCompany)).includes(inEmployeeId)) {
            console.log("Error with POST: Employee does not exist.");
            return response.status(404).json({error:"Employee does not exist in company " + inCompany + "."})
         }

         // Validation 3
         
         // Create new timecard object to insert & insert into data layer
         let newTimecard = new dataLayer.Timecard(inTimecardId, inStartTime, inEndTime, inEmployeeId);
         let updatedTimecard = dataLayer.updateTimecard(newTimecard);

         // If updatedTimecard is null
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
   console.log("\n");
   console.log("Received DELETE for '/timecard'");

   // Get variables from query
   let inCompany = request.query.company;
   let inTimecardId = request.query.timecard_id;

   // Try to delete stuff from data layer
   try {
      let formerTimecard = dataLayer.deleteTimecard(inTimecardId);
      if (formerTimecard == 0) {
         return response.status(404).json({"error":`Timecard ${inTimecardId} does not exist in Company.`});
      }

      return response.status(200).json({success:"Timecard " + inTimecardId + " from " + inCompany + " deleted."});
   } catch(error) {
      console.error("Error deleting timecard ''" + inTimecardId + "'': " + error);
      return response.status(404).json({"error":"Could not delete timecard ''" + inTimecardId + "''."});
   }
});


// Allows server.js to see the timecard router
module.exports = router;
