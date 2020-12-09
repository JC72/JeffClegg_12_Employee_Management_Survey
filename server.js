const inquirer = require("inquirer");
const fs = require("fs");
var mysql = require("mysql");

// calls the function to start mySql
const connection = require("./lib/js/connection");

//These are needed so to call various files needed for the inquirer prompts and menu choices
const mainMenu = require('./lib/js/mainMenuChoices')
const prompts = require('./lib/js/prompts')

// Created a array that contain the inquirer prompts that will be used
const inquirerTypes = [
    'input', 'confim', 'list'
]

// Program Logo requirements based off of package.json file created: 
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());



// Calls the Function to start application
runSearch();

//Function to generate the prompts and menu selections for the application
function runSearch() {

    
}

})