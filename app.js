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

connection.connect(err => {
  if (err) {
    throw err;
  }
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

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
        "Update employee roles"
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
      } else if (answer.action === "Update employee roles") {
        return update();
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
    const departmentNames = results.map(row => row.department_name);
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
          name: "departmentName",
          type: "list",
          message: "Which department does this role belong to?",
          choices: departmentNames
        }
      ])
      .then(answer => {
        const matchedDept = results.find(
          row => row.department_name === answer.departmentName
        );
        return connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.roleTitle,
            salary: answer.salary,
            department_id: matchedDept.id
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

// const addEmployees = () => {
//   return connection.query("SELECT * FROM department AND role", (err, results) => {
//     if (err) {
//       throw err;
//     }
//     const departmentNames = results.map(row => row.department_name);
//     const roleNames = results.map(row => row.title);

//     return inquirer
//     .prompt([
//       {
//         name: "employeeFirst",
//         type: "input",
//         message: "What is the employees first name?"
//       },
//       {
//         name: "employeeLast",
//         type: "input",
//         message: "What is the employees last name?"
//       },
//       {
//         name: "salary",
//         type: "input",
//         message: "What is role's salary?",
//         validate: value => (isNaN(value) ? "Enter a number." : true)
//       },
//       {
//         name: "departmentName",
//         type: "list",
//         message: "Which department does this role belong to?",
//         choices: departmentNames
//       }
//     ])
//   });
// }

// view department
const viewDepartments = () => {
  return connection.query("SELECT * FROM department", (err, results) => {
    if (err) {
      throw err;
    }
    const table = cTable.getTable(results);
    console.log(table);
    return start();
  });
};

// view roles
const viewRoles = () => {
  return connection.query("SELECT * FROM role", (err, results) => {
    if (err) {
      throw err;
    }
    const table = cTable.getTable(results);
    console.log(table);
    return start();
  });
};
