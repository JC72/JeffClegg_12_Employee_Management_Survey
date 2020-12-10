const inquirer = require('inquirer');
const fs = require('fs');
var mysql = require('mysql');
var util = require('util');


//These are needed so to call various files needed for the inquirer prompts and menu choices
const mainMenu = require('./lib/js/mainMenuChoices');
const prompts = require('./lib/js/prompts');

// Created a array that contain the inquirer "types" that will be used
const inquirerTypes = [
    'input', 'confim', 'list'
]

// Program Logo requirements based off of package.json file created: 
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_manager"
});


// Make connection.
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);

    // Calls the Function to start application
        runSearch();
  });



//Function to generate the prompts and menu selections for the application
function runSearch() {
    //const menuMain = new InqFuncs(inquirerTypes[2], 'action', prompts.mainMenuPrompt, mainMenu);

     inquirer
    .prompt({
        
        name: 'action',
        type: inquirerTypes[2],
        message: prompts.mainMenuPrompt,
        choices: mainMenu

    }).then(answers => {
                    
        switch(answers.action) {

            // view All departments
            case mainMenu[0]:
                allDep();
                break;

            // view All Roles
            case mainMenu[1]:
                allRoles();
                break;

            // view all employees
            case mainMenu[2]:
                allEmployees();
                break;

            // views all employees by department
            case mainMenu[3]:
                allEmpDept();
                break;

            // views all employees by manager
            case mainMenu[4]:
                allEmpMan();
                break;

            // views all employees by role
            case mainMenu[5]:
                views.allEmpRole();
                break;

            // views all managers
            case mainMenu[6]:
                views.allManagers();
                break;

            // adds a department
            case mainMenu[7]:
            //     adds.
                break;

            // Removes a department
            case mainMenu[8]:
            //     adds.
                break;

            // adds a role
            case mainMenu[9]:
                //     adds.
                    break;

            // removes a role
            case mainMenu[10]:
                //     adds.
                    break;

            // adds a employee
            case mainMenu[11]:
                //     adds.
                    break;

            // removes a employee
            case mainMenu[12]:
                //     adds.
                    break;

            // Update employee role
            case mainMenu[13]:
            //     adds.
                break;

            // Update employee manager
            case mainMenu[14]:
            //     adds.
                break;

            // update employee salary
            case mainMenu[15]:
            //     adds.
                break;

        // quit application
            case mainMenu[16]:
		    return quit();
            
        }
        });
}

function allDep() {

    const query = 'SELECT department.d_name FROM department'

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function  allRoles() {

    const query = 'SELECT role.title FROM role'

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function  allEmployees() {

    const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.d_name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager ' +
    'FROM employee LEFT JOIN role on employee.role_id = role.id ' +
    'LEFT JOIN department on role.department_id = department.id ' +
    'LEFT JOIN employee manager on manager.id = employee.manager_id'

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function  allEmployees() {

    const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.d_name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager ' +
    'FROM employee LEFT JOIN role on employee.role_id = role.id ' +
    'LEFT JOIN department on role.department_id = department.id ' +
    'LEFT JOIN employee manager on manager.id = employee.manager_id'

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function quit() {
    console.log("Goodbye!");
    process.exit();

  }