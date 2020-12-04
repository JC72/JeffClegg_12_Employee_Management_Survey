const inquirer = require("inquirer");
const fs = require("fs");
const cTable = require('console.table');
var mysql = require("mysql");
const util = require("util");
const connection = require("./lib/js/sqlStart");

// Program Logo requirements based off of package.json file created: 
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());



connection.connect((err) => {
    if (err) {
        console.log(err);
        res.status(500);
        return res.send("There was an error connecting to the database.");
    } console.log("You're connected!");

    // Function for inquirer to prompt data
    runSearch();

})