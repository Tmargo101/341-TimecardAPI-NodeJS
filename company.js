let express = require('express');
let router = express.Router();

let DataLayer = require("./companydata/index.js");

// DELETE all company data from company
router.delete("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received DELETE for '/company'");

   // Get variables from query
   let inCompany = request.query.company;

   // Try to delete stuff from data layer
   try {
      let formerCompany = dataLayer.deleteCompany(inCompany);
      return response.status(200).json({success: inCompany + "'s information deleted.'"});
   } catch(error) {
      console.error("Error deleting company: " + error);
      return response.status(404).json({"error":"Could not delete company ''" + inCompany + "''."});
   }
});


// Allows server.js to see the company router
module.exports = router;
