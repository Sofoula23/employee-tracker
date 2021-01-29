const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employees"
});

const askUserAction = async () => {
    const question = [
        {
            type: "list",
            name: "userAction",
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
                    value: "updateEmployeeRole"
                }

            ]
        }
    ]
    const { userAction } = await inquirer.prompt(question);
    return userAction;
}

const askForEmployeeInformation = async () => {
    const roles = await getRoles();
    const question = [
        {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name"
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name"
        },
        {
            type: "list",
            name: "roleId",
            message: "Choose the employee's role",
            // create an array of options from the role records retrieved from the DB
            choices: roles.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        }
    ]
    const employeeInformation = await inquirer.prompt(question);
    return employeeInformation;
}

const askForEmployeeRoleUpdateInformation = async () => {
    const employees = await getEmployees();
    const roles = await getRoles();
    const question = [
        {
            type: "list",
            name: "employeeId",
            message: "Choose employee",
            // create an array of options from the role records retrieved from the DB
            choices: employees.map(e => {
                return {
                    name: `${e.first_name} ${e.last_name}`,
                    value: e.id
                }
            })
        },
        {
            type: "list",
            name: "roleId",
            message: "Choose the employee's role",
            // create an array of options from the role records retrieved from the DB
            choices: roles.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        }
    ]
    const updateRoleInformation = await inquirer.prompt(question);
    return updateRoleInformation;
}

const askForRoleInformation = async () => {
    const departments = await getDepartments();
    const question = [
        {
            type: "input",
            name: "title",
            message: "Enter the role title"
        },
        {
            type: "number",
            name: "salary",
            message: "Enter the role salary"
        },
        {
            type: "list",
            name: "departmentId",
            message: "Choose a department",
            // create an array of options from the dept records retrieved from the DB
            choices: departments.map(dept => {
                return {
                    name: dept.name,
                    value: dept.id
                }
            })
        }
    ]
    const roleInformation = await inquirer.prompt(question);
    return roleInformation;
}

const askForDepartmentName = async () => {
    const question = [
        {
            type: "input",
            name: "name",
            message: "Enter the new department name"
        }
    ]
    const { name } = await inquirer.prompt(question);
    return name;
}

const getEmployees = () => {
    const sql = `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id
        LEFT JOIN employee manager on manager.id = employee.manager_id
    `

    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results) {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    })
}

const getRoles = () => {
    const sql = `
        SELECT r.id, r.title, r.salary, d.name AS department_name
        FROM role r
        INNER JOIN department d ON r.department_id = d.id 
    `;
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

const getDepartments = () => {
    const sql = 'SELECT * FROM department'
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results, fields) {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

const viewEmployees = async () => {
    const employees = await getEmployees();
    console.table(employees);
}

const viewRoles = async () => {
    const roles = await getRoles();
    console.table(roles);
}

const viewDepartments = async () => {
    const depts = await getDepartments();
    console.table(depts);
}

const addEmployee = (employeeInformation) => {
    let stmt = `
        INSERT INTO employee
        (first_name, last_name, role_id)
        VALUES('${employeeInformation.firstName}', '${employeeInformation.lastName}', ${employeeInformation.roleId}); 
    `;
    return connection.query(stmt, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

const updateEmployeeRole = (updateRoleInformation) => {
    let stmt = `
        UPDATE employee
        SET role_id = ${updateRoleInformation.roleId}
        WHERE id = ${updateRoleInformation.employeeId};
    `;
    return connection.query(stmt, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

const addRole = (roleInformation) => {
    let stmt = `
        INSERT INTO role
        (title, salary, department_id)
        VALUES('${roleInformation.title}', '${roleInformation.salary}', ${roleInformation.departmentId}); 
    `;
    return connection.query(stmt, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

const addDepartment = (departmentName) => {
    let stmt = `
        INSERT INTO department
        (name)
        VALUES('${departmentName}'); 
    `;
    return connection.query(stmt, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

const start = async () => {
    const userAction = await askUserAction();
    switch (userAction) {
        case "viewEmloyees":
            viewEmployees();
            break;
        case "viewRoles":
            viewRoles();
            break;
        case "viewDepartments":
            viewDepartments();
            break;
        case "addEmployee":
            const employeeInfo = await askForEmployeeInformation();
            try {
                await addEmployee(employeeInfo);
                console.log('Employee was added succesfully');
            } catch (e) {
                console.log('An error occurred while adding the employee');
            }
            break;
        case "addRole":
            const roleInformation = await askForRoleInformation();
            try {
                await addRole(roleInformation);
                console.log('Role successfuly added');
            } catch (e) {
                console.log('An error occurred while adding the role')
            }
            break;
        case "addDepartment":
            const departmentName = await askForDepartmentName();
            try {
                await addDepartment(departmentName);
                console.log('Department successfuly added');
            } catch (e) {
                console.log('An error occurred while adding the department')
            }
            break;
        case "updateEmployeeRole":
            const updateRoleInformation = await askForEmployeeRoleUpdateInformation();
            try {
                await updateEmployeeRole(updateRoleInformation);
                console.log('Employee role was updated succesfully');
            } catch (e) {
                console.log('An error occurred while updating the employee role');
            }
            break;
    }
    connection.end();
}

connection.connect(function (err) {
    if (err) throw err;
    start();
});