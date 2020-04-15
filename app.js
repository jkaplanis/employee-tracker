const mysql = require("mysql");
const inquirer = require("inquirer");

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
      message: "Would you like to [Add], [View], or [Update] a department?",
      choices: ["Add", "View", "Update"]
    })
    .then(answer => {
      // based on their answer, call appropriate function
      if (answer.action === "Add") {
        return add();
      } else if (answer.action === "View") {
        return view();
      } else if (answer.action === "Update") {
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

// add department first
const add = () => {};
