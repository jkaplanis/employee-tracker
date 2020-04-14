INSERT INTO department (department_id, department_name)
VALUES (1, "Technology"), (2, "Sales"), (3, "Management"), (4, "Finance"), (5, "Marketing");

INSERT INTO role (role_id, title, salary, department_id)
VALUES (1, "Lead Engineer", 100000, 1), (2, "Software Engineer", 100000, 1), 
(3, "CEO", 250000, 3), (4, "CIO", 200000, 1), (5, "VP of Sales", 150000, 2),
(6, "Sales Rep", 60000, 2), (7, "VP of Marketing", 100000, 5), (8, "Marketing rep", 100000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Kaplanis", 1, 4), (2, "Amber", "Kaplanis", 2, 1),
(3, "Michael", "Scott", 3, null), (4, "Jim", "Norton", 7, 3),
(5, "James ", "Benson", 5, 3), (6, "Dave", "Smith", 6, 5),
(7, "Rory", "Bloch", 8, 7), (8, "Joe", "Cosmano", 4, 3);

SELECT employee.id, employee.first_name, employee.last_name, 
role.title, role.salary, department.department_name FROM employee 
JOIN role ON employee.role_id = role.role_id 
JOIN department ON role.department_id = department.department_id;