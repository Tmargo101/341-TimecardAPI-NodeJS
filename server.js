// Tom Margosian
// ISTE-341 Project 3

let express = require("express");
const app = express();

let DataLayer = require("./companydata/index.js");
let dl = new DataLayer('txm5483');



// GET all departments from company
app.get("/departments", function(request, response) {
   console.log("GET Request for '/departments'");
   var departments = new dl.Department('txm5483');
   console.log(departments);
   response.send("GET Request for '/departments"+ departments);

});

// GET a department from company
app.get("/department", function(request, response) {
   console.log("GET Request for '/department'");
   response.send("GET Request for '/department");
});

// GET all employees from company
app.get("/employees", function(request, response) {
   console.log("GET Request for '/employees'");
   response.send("GET Request for '/employees");
});

// GET an employee from the company
app.get("/employee", function(request, response) {
   console.log("GET Request for '/employee'");
   response.send("GET Request for '/employee");
});

// GET all timecards from company
app.get("/timecards", function(request, response) {
   console.log("GET request for '/timecards'");
   response.send("Hello GET");
});

// GET a timecard from company
app.get("/timecard", function(request, response) {
   console.log("GET request for '/timecards'");
   response.send("Hello GET");
});




// POST a timecard to company
app.post("/timecard", function(request, response) {
   console.log("GET request for '/timecard'");
   console.log(request.param('id'));
   response.send("Hello POST");
});

// Get a timecard from company
app.delete("/timecard", function(request, response) {
   console.log("POST request for '/'");
   response.send("Hello DELETE");
});

var server = app.listen(8081,function() {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Server listening at localhost:8081")
})
