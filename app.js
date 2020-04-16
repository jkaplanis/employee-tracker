const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "employeeDB"
});

// start connection to database
connection.connect(err => {
  if (err) {
    throw err;
  }
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

// Choose next answer
const start = () => {
  return inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add departments",
        "Add roles",
        "Add employees",
        "View departments",
        "View roles",
        "View employees",
        "Update employee roles",
        "Exit"
      ]
    })
    .then(answer => {
      // based on their answer, call appropriate function
      if (answer.action === "Add departments") {
        return addDepartments();
      } else if (answer.action === "Add roles") {
        return addRoles();
      } else if (answer.action === "Add employees") {
        return addEmployees();
      } else if (answer.action === "View departments") {
        return viewDepartments();
      } else if (answer.action === "View roles") {
        return viewRoles();
      } else if (answer.action === "View employees") {
        return viewEmployees();
      } else if (answer.action === "Update employee roles") {
        return updateEmployeeRoles();
      } else {
        connection.end();
      }
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
};

// add department
const addDepartments = () => {
  return inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "What is the name of the department?"
    })
    .then(answer => {
      return connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: answer.departmentName
        },
        err => {
          if (err) {
            throw err;
          }
          console.log("Your department was added successfully!");
          // re-prompt the user for their next action
          return start();
        }
      );
    });
};

// add roles
const addRoles = () => {
  return connection.query("SELECT * FROM department", (err, results) => {
    if (err) {
      throw err;
    }
    const departmentNames = results.map(row => {
      return {
        name: row.department_name,
        value: row.id
      };
    });
    return inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What is the name of the role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is role's salary?",
          validate: value => (isNaN(value) ? "Enter a number." : true)
        },
        {
          name: "departmentID",
          type: "list",
          message: "Which department does this role belong to?",
          choices: departmentNames
        }
      ])
      .then(answer => {
        return connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.roleTitle,
            salary: answer.salary,
            department_id: answer.departmentID
          },
          err => {
            if (err) {
              throw err;
            }
            console.log("Your role was added successfully!");
            // re-prompt the user for their next action
            return start();
          }
        );
      });
  });
};

// add employees
const addEmployees = () => {
  connection.query("SELECT title, id FROM role", (err, roles) => {
    if (err) {
      throw err;
    }
    const roleNames = roles.map(row => {
      return {
        name: row.title,
        value: row.id
      };
    });

    connection.query(
      "SELECT id, concat(first_name, ' ', last_name) AS name FROM employee",
      (err, employees) => {
        if (err) {
          throw err;
        }
        const managerNames = employees.map(row => {
          return {
            name: row.name,
            value: row.id
          };
        });
        managerNames.unshift({
          name: "No Manager",
          value: null
        });
        return inquirer
          .prompt([
            {
              name: "employeeFirst",
              type: "input",
              message: "What is the employee's first name?"
            },
            {
              name: "employeeLast",
              type: "input",
              message: "What is the employee's last name?"
            },
            {
              name: "roleID",
              type: "list",
              message: "What is the employee's role?",
              choices: roleNames
            },
            {
              name: "managerID",
              type: "list",
              message: "Who does this employee report to?",
              choices: managerNames
            }
          ])
          .then(answer => {
            return connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.employeeFirst,
                last_name: answer.employeeLast,
                role_id: answer.roleID,
                manager_id: answer.managerID
              },
              err => {
                if (err) {
                  throw err;
                }
                console.log("Your employee was added successfully!");
                // re-prompt the user for their next action
                return start();
              }
            );
          });
      }
    );
  });
};

// view department
const viewDepartments = () => {
  return connection.query(
    "SELECT department_name FROM department",
    (err, results) => {
      if (err) {
        throw err;
      }
      const table = cTable.getTable(results);
      console.log(table);
      return start();
    }
  );
};

// view roles
const viewRoles = () => {
  return connection.query(
    `SELECT role.title, role.salary, department.department_name 
    FROM role JOIN department ON role.department_id = department.id`,
    (err, results) => {
      if (err) {
        throw err;
      }
      const table = cTable.getTable(results);
      console.log(table);
      return start();
    }
  );
};

// view employees
const viewEmployees = () => {
  return connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, 
    concat(managers.first_name, " ", managers.last_name) as manager
    FROM employee 
    JOIN employee as managers ON employee.manager_id = managers.id
    JOIN role ON employee.role_id = role.id 
    JOIN department ON role.department_id = department.id
    ORDER BY employee.id`,
    (err, results) => {
      if (err) {
        throw err;
      }
      const table = cTable.getTable(results);
      console.log(table);
      return start();
    }
  );
};

// Update employee roles
const updateEmployeeRoles = () => {
  connection.query("SELECT title, id FROM role", (err, roles) => {
    if (err) {
      throw err;
    }
    const roleNames = roles.map(row => {
      return {
        name: row.title,
        value: row.id
      };
    });

    connection.query(
      "SELECT id, concat(first_name, ' ', last_name) AS name FROM employee",
      (err, employees) => {
        if (err) {
          throw err;
        }
        const employeeNames = employees.map(row => {
          return {
            name: row.name,
            value: row.id
          };
        });
        return inquirer
          .prompt([
            {
              name: "employeeID",
              type: "list",
              message: "Which employee would you like to update?",
              choices: employeeNames
            },
            {
              name: "roleID",
              type: "list",
              message: "What is the employee's new role?",
              choices: roleNames
            }
          ])
          .then(answer => {
            return connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  role_id: answer.roleID
                },
                {
                  id: answer.employeeID
                }
              ],
              err => {
                if (err) {
                  throw err;
                }
                console.log("Your employee role was updated successfully!");
                // re-prompt the user for their next action
                return start();
              }
            );
          });
      }
    );
  });
};
