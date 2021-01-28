USE employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sanitation');

INSERT INTO role
   (title, salary, department_id) 
VALUES
     ('Salesman', 80000.00, 1),
     ('Mechanical Engineer', 150000.00, 2),
     ('Accountant', 120000.00, 3),
     ('Junior Attorney', 75000.00, 4),
     ('Marketing Agent', 70000.00, 1);

INSERT INTO employee 
    (first_name, last_name, role_id, manager_id)
VALUES
     ('Marco', 'Polo', 1, null),
     ('Jackie', 'Onasis', 3, 1),
     ('Aristoteles', 'Grigorakis', 2, 1),
     ('Tucu', 'Cito', 1, 1),
     ('Tutan', 'Camon', 4, 1),
     ('Alli', 'Gator', 2, 1);
