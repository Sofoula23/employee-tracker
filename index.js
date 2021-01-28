var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

// Function to prompt user to chose action
function start() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: [
                    {
                        name: "View ALL employees",
                        value: "viewEmloyees"
                    },
                    {
                        name: "View ALL roles",
                        value: "viewRoles"
                    },
                    {
                        name: "View ALL departments",
                        value: "viewDepartments"
                    },
                    {
                        name: "Add employee",
                        value: "addEmployee"
                    },
                    {
                        name: "Add role",
                        value: "addRole"
                    },
                    {
                        name: "Add department",
                        value: "addDepartment"
                    },
                    {
                        name: "Update employee role",
                        value: "update"
                    }

                ]
            },
        ]).then(function (answer) {
           switch(answer.choice){
            case "viewEmloyees":
                viewEmployees();
                break;
            case "viewRoles":
                break;
            case "viewDepartments":
                break;
            case "addEmployee":
                break;
            case "addRole":
                break;
            case "addDepartment":
                break;
            case "update":
                break;
           }
        })

}
function viewEmployees() {
    const sql = `
    SELECT * FROM employee
    
    
    
    `
    connection.query(, function (error, results, fields) {
        console.table(results);
      });   
}