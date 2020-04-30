let express = require('express');
let router = express.Router();

let DataLayer = require("./companydata/index.js");


// GET an employee from company (WORKING)
router.get("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received GET for '/employee'");

   // Get variables from query
   let inCompany = request.query.company;
   let inEmployeeId = request.query.emp_id;

   // Try to get stuff from data layer
   try {
      let employee = dataLayer.getEmployee(inEmployeeId);
      if (employee) {
         return response.status(200).json(employee);
      }
      return response.status(404).json({"error":"Could not get employee '" + inEmployeeId +  "''."});
   } catch(error) {
      console.error("Error getting employee: " + error);
      return response.status(404).json({"error":"Could not get employee '" + inEmployeeId +  "''."});
   }
});


// POST a new department to company (WORKING)
router.post("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received POST for '/departments'");

   // Get variables from body
   let inCompany = request.body.company;
   let inEmployeeName = request.body.emp_name;
   let inEmployeeNo = "txm5483-" + request.body.emp_no;
   let inHireDate = request.body.hire_date;
   let inJob = request.body.job;
   let inSalary = request.body.salary;
   let inDeptId = request.body.dept_id;
   let inManagerId = request.body.mng_id;

   // If all query variables are not null
   if (inCompany && inEmployeeName && inEmployeeNo && inHireDate && inJob && inSalary && inDeptId && inManagerId) {

      try {
         // Validations

         // Check if company name is txm5483
         if (inCompany != "txm5483") {
            console.log("Error with POST: company does not match.");
            return response.status(404).json({error:"Company does not match '" + inCompany + "'."})
         }

         // Check if there is a department in company
         if (JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes("{" + inDeptId + "}")) {
            console.log("Error with POST: Department does not exist.");
            return response.status(404).json({error:"Department does not exist in company " + inCompany + "."})
         }

         // // Check if there is a department in company
         // if (!JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes("{" + inDeptNo + "}")) {
         //    console.log("Error with POST: Department does not exist.");
         //    return response.status(404).json({error:"Department does not exist in company " + inCompany + "."})
         // }

         // Check if


         // Create new employee object to insert & insert into data layer
         let newEmployee = new dataLayer.Employee(inEmployeeName, inEmployeeNo, inHireDate, inJob, inSalary, inDeptId, inManagerId);
         let insertedEmployee = dataLayer.insertEmployee(newEmployee);

         // If insertedEmployee is null
         if (!insertedEmployee) {
            console.log("Error with POST: Did not insert employee.");
            return response.status(404).json({error:"Did not insert employee."});
         }

         // Return inserted employee
         return response.status(200).json({success:insertedEmployee});

      } catch(error) {
         console.error("Error inserting employee: " + error);
         return response.status(404).json({error:"Could not get employee."});
      } // End catch

   } else {
      // If all fields in query are NOT filled out
      return response.status(404).json({error:"Not all fields are filled out."});
   }
});


// Update an employee
router.put("/", function(request, response) {

   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received PUT for '/employee'");

   // Get variables from body
   let inCompany = request.body.company;
   let inEmployeeId = request.body.emp_id
   let inEmployeeName = request.body.emp_name;
   let inEmployeeNo = request.body.emp_no;
   let inHireDate = request.body.hire_date;
   let inJob = request.body.job;
   let inSalary = request.body.salary;
   let inDeptId = request.body.dept_id;
   let inManagerId = request.body.mng_id;

   if (inCompany && inEmployeeId >= 0 && inEmployeeName && inEmployeeNo && inHireDate && inJob && inSalary && inDeptId && inManagerId >= 0) {
      // Try to post stuff to data layer
      try {

         // // Check if Department ID exists in Company
         // if (!JSON.stringify(dataLayer.getAllEmployee(inCompany)).includes(inDeptId)) {
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
         let newEmployee = new dataLayer.Employee(inEmployeeName, inEmployeeNo, inHireDate, inJob, inSalary, inDeptId, inManagerId ,inEmployeeId);
         let updatedEmployee = dataLayer.updateEmployee(newEmployee);

         // If updatedDepartment is null
         if (!updatedEmployee) {
            return response.status(404).json({error:"Did not update employee."})
         }
         // Return successful
         return response.status(200).json({success:updatedEmployee});

      } catch(error) {
         console.error("Error updating employee: " + error);
         return response.status(404).json({error:"Could not update employee."});
      }
   } else {
      return response.status(404).json({error:"Not all fields are filled out."});
   }
});


// Delete an employee
router.delete("/", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received DELETE for '/employee'");

   // Get variables from query
   let inCompany = request.query.company;
   let inEmployeeId = request.query.emp_id;

   // Try to delete stuff from data layer
   try {
      // if (!JSON.stringify(dataLayer.getAllDepartment(inCompany)).includes(inEmployeeId)) {
      let formerEmployee = dataLayer.deleteEmployee(inEmployeeId);
      if (formerEmployee == 0) {
         return response.status(404).json({"error":"Employee '" + inDeptId + "' does not exist in Company."});
      }
      return response.status(200).json({success:"Employee " + inEmployeeId + " from " + inCompany + " deleted."});
   } catch(error) {
      console.error("Error deleting employee ''" + inEmployeeId + "'': " + error);
      return response.status(404).json({"error":"Could not delete employee ''" + inEmployeeId + "''."});
   }
});




// Allows server.js to see the employee router
module.exports = router;
