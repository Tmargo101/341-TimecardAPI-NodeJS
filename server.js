// Tom Margosian
// ISTE-341 Project 3

// Import express
let express = require("express");
const app = express();

let bodyParser = require("body-parser");
let DataLayer = require("./companydata");

// Used for body parser
app.use(express.json());
app.use(express.urlencoded({extended:false}))

// Forward all /department
let department = require('./department');
app.use('/CompanyServices/department', department);
// app.use('/departments', department);

let employee = require('./employee');
app.use('/CompanyServices/employee', employee);

let timecard = require("./timecard");
app.use('/CompanyServices/timecard', timecard);

let company = require('./company');
app.use('/CompanyServices/company', company);


//////////////////////////////////////////// START OTHER ROUTES HANDLING ////////////////////////////////////////////

// Get all departments from a company
app.get("/CompanyServices/departments", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received GET for '/departments'");

   // Get variables from query
   let inCompany = request.query.company;
   // Try to get stuff from data layer
   try {
      let departments = dataLayer.getAllDepartment(inCompany);
      return response.status(200).json(departments);
   } catch(error) {
      console.error("Error getting departments: " + error);
      return response.status(404).json({"error":"Could not get departments."});
   }
});

// Get all employees from a company
app.get("/CompanyServices/employees", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received GET for '/employees'");

   // Get variables from query
   let inCompany = request.query.company;

   // Try to get stuff from data layer
   try {
      let employees = dataLayer.getAllEmployee(inCompany);
      return response.status(200).json(employees);
   } catch(error) {
      console.error("Error getting employees: " + error);
      return response.status(404).json({"error":"Could not get employees."});
   }
});

// Get all timecards from a company
app.get("/CompanyServices/timecards", function(request, response) {
   let dataLayer = new DataLayer('txm5483');
   console.log("\n");
   console.log("Received GET for '/timecards'");

   // Get variables from query
   let inCompany = request.query.company;
   let inEmployeeId = request.query.emp_id;

   // Try to get stuff from data layer
   try {
      let timecards = dataLayer.getAllTimecard(inEmployeeId);
      if (timecards) {
         return response.status(200).json(timecards);
      }
      return response.status(404).json({"error":"Could not get timecards for employee '" + inEmployeeId + "'."});
   } catch(error) {
      console.error("Error getting timecards: " + error);
      return response.status(404).json({"error":"Could not get timecards."});
   }
});

//////////////////////////////////////////// END OTHER ROUTES HANDLING ////////////////////////////////////////////


///////////////////////////////////////////////// START SERVER ////////////////////////////////////////////////////

var server = app.listen(8080,function() {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Server listening at localhost:8080")
})
