USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "Video Game", 299.00, 5000),
("Echo Dot", "Amazon Devices", 19.99, 55000),
("Bose QuietComfort Wireless Headphones", "Electronics", 349.00, 500),
("Ring Video Doorbell", "Electronics", 169.00, 540),
("Becoming", "Books", 14.99, 55000),
("Taste Of The Wild Grain Free High Protein Dry Dog Food", "Pet Supplies", 48.99, 5000),
("GoFloats Unicorn Pool Float", "Sports & Outdoors", 11.99, 5000),
("PlayStation 4", "Video Game", 299.85, 5000),
("Xbox One S", "Video Game", 299.00, 5000),
("Philips Sonicare Diamond Clean Rechargeable Toothbrush", "Beauty", 186.99, 800);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Video Game", 1550.00),
("Electronics", 708.08),
("Amazon Devices", 30.00),
("Books", 10.91),
("Pet Supplies", 22.64),
("Sports & Outdoors", 8.88),
("Beauty", 367.68);