const inquirer = require('inquirer');
const fs = require('fs');
var mysql = require('mysql');
var util = require('util');
var EventListener = require('events').EventEmitter.defaultMaxListeners = 30;

//These are needed so to call various files needed for the inquirer prompts and menu choices
const mainMenu = require('./lib/js/mainMenuChoices');
const prompts = require('./lib/js/prompts');

// Created a array that contain the inquirer "types" that will be used
const inquirerTypes = [
    'input', 'confirm', 'list'
]

// Program Logo requirements based off of package.json file created: 
const logo = require('asciiart-logo');
const config = require('./package.json');
const { clear } = require('console');
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

  let roleNameArr = [];
  let roleArr = [];

  const query1 = 'SELECT role.id, role.title FROM role'

  const rolequery = connection.query(query1, function(err, res) {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
          let roleTitle = res[i].title;
          let roleObj = {
              ID: res[i].id,
              title: res[i].title
          }

          roleArr.push(roleObj);
          roleNameArr.push(roleTitle);
      }

  })

  let deptNameArr = [];
  let deptArr = [];

  const query3 = `SELECT * FROM employee_manager.department;`

  const overallQuery = connection.query(query3, function(err, res) {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
          let deptTitle = res[i].d_name;
          let deptObj = {
              ID: res[i].id,
              title: res[i].d_name
          }

          deptArr.push(deptObj);
          deptNameArr.push(deptTitle);
      }

  })

  let empNameArr = [];
  let empArr = [];

  const query4 = `SELECT employee.id, employee.first_name, employee.last_name FROM employee_manager.employee;`

  const empQuery = connection.query(query4, function(err, res) {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
          let empTitle = res[i].first_name + " " + res[i].last_name;
          let empObj = {
              ID: res[i].id,
              FirstName: res[i].first_name,
              LastName: res[i].last_name
          }

          empArr.push(empObj);
          empNameArr.push(empTitle);
      }
  })

  let manNameArr = [];
  let manArr = [];

  const query5 = `SELECT employee.id, employee.first_name, employee.last_name, department.d_name
  FROM employee
  INNER JOIN role on role.id = employee.role_id
  INNER JOIN department on department.id = role.department_id
  WHERE employee.id IN ( SELECT employee.manager_id FROM employee );`

  const manQuery = connection.query(query5, function(err, res) {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
          let manTitle = res[i].first_name + " " + res[i].last_name;
          let manObj = {
              ID: res[i].id,
              FirstName: res[i].first_name,
              LastName: res[i].last_name
          }

          manArr.push(manObj);
          manNameArr.push(manTitle);
      }
  })
        


//Function to generate the prompts and menu selections for the application
async function runSearch() {
    
     await inquirer
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

            // views all managers
            case mainMenu[5]:
                allManagers();
                break;

            // adds a department
            case mainMenu[6]:
                addDept();
                break;

            // Removes a department
            case mainMenu[7]:
                remDept();
                break;

            // adds a role
            case mainMenu[8]:
                addRole();
                    break;

            // removes a role
            case mainMenu[9]:
                remRole();
                break;

            // adds a employee
            case mainMenu[10]:
                addEmp();
                break;

            // Update employee role
            case mainMenu[11]:
                updEmpRole();
                break;

        // quit application
            case mainMenu[12]:
		    return quit();
            
        }
        });
};

function allDep() {

    const query = 'SELECT department.d_name FROM department'

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
};

function  allRoles() {

    const query = 'SELECT role.title FROM role'

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
};

function  allEmployees() {

     const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.d_name AS department,
      role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee 
      LEFT JOIN role on employee.role_id = role.id 
      LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
       

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
};

function  allEmpDept() {

    inquirer.prompt([
        {
        name: 'deptName',
        type: inquirerTypes[2],
        message: prompts.viewAllEmpByDep,
        choices: deptNameArr,
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
};

function  allEmpMan() {

    inquirer.prompt([
        {
        name: 'manView',
        type: inquirerTypes[2],
        message: prompts.searchByManager,
        choices: manNameArr,
        }
        
    ]).then(answers => {

        manName = answers.manView;
            entManName = manName.split(" "),
            manFisrtName = entManName[0],
            manLastName = entManName[1];

            const query6 = connection.query(`SELECT employee.id from employee 
            WHERE (employee.first_name = ? and employee.last_name = ?);`, [manFisrtName, manLastName],
            function (err,res) {
                if (err) throw err;
        
                viewManID = res[0].id;

const query = `SELECT employee.last_name, employee.first_name, role.title, department.d_name
FROM employee
INNER JOIN role on role.id = employee.role_id
INNER JOIN department on department.id = role.department_id
WHERE employee.manager_id = ?`


    var manager = connection.query(query,viewManID,
        
        function (err, manager) {
        if (err) throw err;
        console.table(manager);
        runSearch();
    })

    })
    })
};

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
};

function  addDept() {

    inquirer.prompt([
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
            
            deptNameArr.push(answers.deptName);
            
            allDep();
        })
    })
};

function  remDept() {

    inquirer.prompt([
        {
        name: 'deptName',
        type: inquirerTypes[2],
        message: prompts.deleteDep,
        choices: deptNameArr,
        }
        
    ]).then(answers => {

    const query = `DELETE FROM department WHERE d_name = ?`


        var remDept = connection.query(query, [answers.deptName],
            
            function (err, remDept) {
            if (err) throw err;
            console.log(answers.deptName + ' deleted');
            allDep();
        })
    })
};

async function  addRole() {

    await inquirer.prompt([
        {
        name: 'newRole',
        type: inquirerTypes[0],
        message: prompts.newRole,
        },

        {
        name:'salary',
        type: inquirerTypes[0],
        message: prompts.salary,
        },

        {
        name: 'departmentName',
        type: inquirerTypes[2],
        message: 'What is the department for this roll?',
        choices: deptNameArr,
    }
        
    ]).then( answers => {

        const deptQuery = connection.query(`SELECT department.id from department WHERE department.d_name = ?;`, [answers.departmentName],
        function (err,deptQuery) {
            if (err) { 
                throw err;
            }
            var addDeptID = deptQuery[0].id   
 
    const query = `INSERT INTO role SET title = ?, salary = ?, department_id = ?`


        var nRole = connection.query(query, [answers.newRole, answers.salary, addDeptID],
            
            function (err, nRole) {
            if (err) throw err;
            console.log(answers.newRole + ' added');
            roleNameArr.push(answers.newRole);
            allRoles();
        })
    })
})
            
};

function  remRole() {

    inquirer.prompt([
        {
        name: 'roleTitle',
        type: inquirerTypes[2],
        message: prompts.deleteRole,
        choices: roleNameArr,
        }
        
    ]).then(answers => {
                   

    const query = `DELETE FROM role WHERE title = ?`


        var delRole = connection.query(query, [answers.roleTitle],
            
            function (err, delRole) {
            if (err) throw err;
            console.log(answers.roleTitle + ' deleted');
            allRoles();

        })
    })
};

// "Add employee"
function addEmp() {

    inquirer.prompt([
        {
        name: 'firstName',
        type: inquirerTypes[0],
        message: prompts.addEmployee1,
        },

        {
        name: 'lastName',
        type: inquirerTypes[0],
        message: prompts.addEmployee2,
        },

        {
        name: 'roleTitle',
        type: inquirerTypes[2],
        message: prompts.addEmployee3,
        choices: roleNameArr,
        },

        {
        name: 'managerId',
        type: inquirerTypes[2],
        message: prompts.addEmployee4,
        choices: manNameArr,
        },


        
    ]).then(answers => {

        const query2 = connection.query(`SELECT role.id from role WHERE role.title = ?;`, [answers.roleTitle],
        function (err,query2) {
            if (err) { 
                throw err;
            }
            var addRoleEmpID = query2[0].id;
            
        
            manName = answers.managerId;
            entManName = manName.split(" "),
            manFisrtName = entManName[0],
            manLastName = entManName[1];

            const query6 = connection.query(`SELECT employee.id from employee 
            WHERE (employee.first_name = ? and employee.last_name = ?);`, [manFisrtName, manLastName],
            function (err,query6) {
                if (err) throw err;
        
                addManID = query6[0].id;

        const query = 'INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?'

            var addEmployee = connection.query(query,
                [answers.firstName, answers.lastName, addRoleEmpID, addManID],
                function (error, addEmployee) {
                    if (error) throw error;
                
                console.log('Employee ' + answers.firstName + '' + answers.lastName + ' added');
                var employeeName = answers.firstName + " " + answers.lastName;
                empNameArr.push(employeeName);
                allEmployees();

            })
            })

        })
        })
};
    

function  updEmpRole() {

    inquirer.prompt([

        {
            name: 'employeeId',
            type: inquirerTypes[2],
            message: prompts.addEmployee3,
            choices: empNameArr,
            },

        {
        name: 'roleId',
        type: inquirerTypes[2],
        message: prompts.updateRole,
        choices: roleNameArr,
        },
        
    ]).then(answers => {

        const query2 = connection.query(`SELECT role.id from role WHERE role.title = ?;`, [answers.roleId],
        function (err,res) {
            if (err) { 
                throw err;
            }
            var addRoleID = res[0].id;
            
        
            empName = answers.employeeId;
            entEmpName = empName.split(" "),
            empFisrtName = entEmpName[0],
            empLastName = entEmpName[1];

            const query6 = connection.query(`SELECT employee.id from employee 
            WHERE (employee.first_name = ? and employee.last_name = ?);`, [empFisrtName, empLastName],
            function (err,res) {
                if (err) throw err;
        
                addEmpID = res[0].id;

    const query = "UPDATE employee SET role_id = ? WHERE id = ?"


        var updRole = connection.query(query,[addRoleID, addEmpID],
            
            function (err, updRole) {
            if (err) throw err;
            
            allEmployees();
            })
        })
        })
    })

};

function quit() {
    console.log("Goodbye!");
    process.exit();

  };