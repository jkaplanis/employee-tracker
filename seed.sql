INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (10, "John", "Kaplanis", 3, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Engineer", 100000, 4), (2, "CEO", 250000, 1), (1, "CIO", 200000, 4), (4, "VP of Sales", 150000, 3);

INSERT INTO department (id, name)
VALUES (4, "Technology"), (3, "Sales"), (1, "Management");
