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
        return view();
      } else if (answer.action === "Add employees") {
        return update();
      } else if (answer.action === "View departments") {
        return viewDepartments();
      } else if (answer.action === "View roles") {
        return update();
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
