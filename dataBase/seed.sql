use employee_manager;

INSERT INTO department
    (d_name)
VALUES
    ('IT'),
    ('Production')
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('IT Manager', 65000, 1),
    ('IT Tech', 50000, 1),
    ('Production Manager', 50000, 2),
    ('Team Lead', 40000, 2),
    ('Operator', 30000, 2),
    ('Sales Manager', 100000, 3),
    ('Sales Lead', 90000, 3),
    ('Salesperson', 70000, 3);
    ('Eng. Manager', 110000 , 4),
    ('Software Engineer', 85000, 4),
    ('Lead Engineer', 100000, 4),
    ('Finance Manager', 85000, 5),
    ('Accountant', 70000, 5),
    ('Legal Manager', 250000, 6),
    ('Lawyer', 190000, 6);
    

INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Joel', 'Iles', 1, NULL ),
    ('Theresa', 'Louise', 2, 1),
    ('Mitch', 'Young', 3, NULL),
    ('Duke', 'Johnson', 4, 3),
    ('Josh', 'Maholmes', 5, 3),
    ('Leslie', 'Knope', 6, NULL),
    ('Ron', 'Swanson', 7, 6),
    ('April', 'Ludgate',8, 6),
    ('Donna', 'Awesome', 9, NULL),
    ('Tom', 'Lawerence', 10, 9),
    ('Jeff', 'Simpson', 11, 9),
    ('Bill', 'Gates', 12, NULL),
    ('John', 'Brown', 13, 12),    
    ('Rebecca', 'Lynn', 14, NULL),
    ('Sally', 'Ride',15,14);