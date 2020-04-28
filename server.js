// Tom Margosian
// ISTE-341 Project 3

var express = require("express");
var app = express();

var DataLayer = require("./companydata/index.js");
var dl = new DataLayer('txm5483');
