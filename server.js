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
const { allowedNodeEnvironmentFlags } = require('process');
const { addEmployee1 } = require('./lib/js/prompts');
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
                allEmpRole();
                break;

            // views all managers
            case mainMenu[6]:
                allManagers();
                break;

            // adds a department
            case mainMenu[7]:
                addDept();
                break;

            // Removes a department
            case mainMenu[8]:
                remDept();
                break;

            // adds a role
            case mainMenu[9]:
                addRole();
                    break;

            // removes a role
            case mainMenu[10]:
                remRole();
                break;

            // adds a employee
            case mainMenu[11]:
                addEmp();
                break;

            // removes a employee
            case mainMenu[12]:
                remEmp();
                 break;

            // Update employee role
            case mainMenu[13]:
                updEmpRole();
                break;

            // Update employee manager
            case mainMenu[14]:
                updEmpMan();
                break;

            // update employee salary
            case mainMenu[15]:
                updEmpSal();
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

     const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.d_name
     FROM employee
     INNER JOIN role on role.id = employee.role_id
     INNER JOIN department on department.id = role.department_id;`
       

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

async function  allEmpDept() {

    await inquirer.prompt([
        {
        name: 'deptName',
        type: inquirerTypes[0],
        message: prompts.viewAllEmpByDep,
        }
    ]).then(answers => {

        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.d_name
        FROM employee
        INNER JOIN role on role.id = employee.role_id
        INNER JOIN department on department.id = role.department_id AND department.d_name = ? ;`
    
    
        var department = connection.query(query,[answers.deptName],
            
            function (err, department) {
            if (err) throw err;
            console.table(department);
            runSearch();
        })
    })
}

// async function  allEmpMan() {

//     await inquirer.prompt([
//         {
//         name: 'empMan',
//         type: inquirerTypes[0],
//         message: prompts.viewAllEmpByDep,
//         }
//     ]).then(answers => {

//     const query = 'SELECT employee.id, employee.first_name, employee.last_name, department.d_name, employee.manager_id AS department, role.title FROM employee ' +
//     'LEFT JOIN role on role.id = employee.role_id ' +
//     'LEFT JOIN department ON department.id = role.department_id WHERE manager_id;'


//     var manager = connection.query(query,
        
//         function (err, manager) {
//         if (err) throw err;
//         console.table(manager);
//         runSearch();
//     })
// }

// function  allEmpRole() {

//     const query = 


//     var  = connection.query(query,
        
//         function (err, manager) {
//         if (err) throw err;
//         console.table(manager);
//         runSearch();
//     })
// }

function  allManagers() {

    const query = `SELECT employee.id, employee.first_name, employee.last_name, department.d_name
    FROM employee
    INNER JOIN role on role.id = employee.role_id
    INNER JOIN department on department.id = role.department_id
    WHERE employee.id IN ( SELECT employee.manager_id FROM employee );`


    var manager = connection.query(query,
        
        function (err, manager) {
        if (err) throw err;
        console.table(manager);
        runSearch();
    })
}

async function  addDept() {

    await inquirer.prompt([
        {
        name: 'deptName',
        type: inquirerTypes[0],
        message: prompts.newDep,
        }
        
    ]).then(answers => {

    const query = `INSERT INTO department SET d_name = ?`


        var newDept = connection.query(query, [answers.deptName],
            
            function (err, newDept) {
            if (err) throw err;
            console.log(answers.deptName + ' added');
            allDep();
            runSearch();
        })
    })
}

async function  remDept() {

    await inquirer.prompt([
        {
        name: 'deptName',
        type: inquirerTypes[0],
        message: prompts.deleteDep,
        }
        
    ]).then(answers => {

    const query = `DELETE FROM department WHERE d_name = ?`


        var newDept = connection.query(query, [answers.deptName],
            
            function (err, manager) {
            if (err) throw err;
            console.log(answers.deptName + ' deleted');
            allDep();
            runSearch();
        })
    })
}

async function  addRole() {

    await inquirer.prompt([
        {
        name: 'newRole',
        type: inquirerTypes[0],
        message: prompts.newRole,
        }
        
    ]).then(answers => {

    const query = `INSERT INTO role SET title = ?`


        var nRole = connection.query(query, [answers.newRole],
            
            function (err, nRole) {
            if (err) throw err;
            console.log(answers.newRole + ' added');
            allRoles();
            runSearch();
        })
    })
}

async function  remRole() {

    await inquirer.prompt([
        {
        name: 'roleTitle',
        type: inquirerTypes[0],
        message: prompts.deleteRole,
        }
        
    ]).then(answers => {

    const query = `DELETE FROM role WHERE title = ?`


        var delRole = connection.query(query, [answers.roleTitle],
            
            function (err, delRole) {
            if (err) throw err;
            console.log(answers.roleTitle + ' deleted');
            allRoles();
            runSearch();
        })
    })
}

// "Add employee"
async function addEmp() {

    await inquirer.prompt([
        {
        name: 'firstName',
        type: inquirerTypes[0],
        message: prompts.addEmployee1,
        },

        {
        name: 'lastName',
        type: iquirerTypes[0],
        message: prompts.addEmployee2,
        },

        {
        name: 'roleId',
        type: iquirerTypes[0],
        message: prompts.addEmployee3,
        },

        {
        name: 'managerId',
        type: iquirerTypes[0],
        message: prompts.addEmployee4,
        },


        
    ]).then(answers => {

    const query = 'INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?'

    var addemployee = connection.query(query,
        [answers.firstName, answers.lastName, answers.roleID, answers.managerId],
        function (error, addemployee) {
            if (error) throw error;
        
        console.log('Employee' + answers.firstname + '' + answers.lastName + ' added');
        allEmployees();

        })
    })
}
// function  allManagers() {

//     const query = 


//     var manager = connection.query(query,
        
//         function (err, manager) {
//         if (err) throw err;
//         console.table(manager);
//         runSearch();
//     })
// }

function quit() {
    console.log("Goodbye!");
    process.exit();

  }