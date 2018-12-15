USE bamazon_db;

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Nintendo Switch", "Video Game", 299.00, 5000, 0),
("Echo Dot", "Amazon Devices", 19.99, 5500, 0),
("Bose QuietComfort Wireless Headphones", "Electronics", 349.00, 500, 0),
("Ring Video Doorbell", "Electronics", 169.00, 540, 0),
("Becoming", "Books", 14.99, 55000, 0),
("Taste Of The Wild Grain Free High Protein Dry Dog Food", "Pet Supplies", 48.99, 5000, 0),
("GoFloats Unicorn Pool Float", "Sports & Outdoors", 11.99, 5000, 0),
("PlayStation 4", "Video Game", 299.85, 5000, 0),
("Xbox One S", "Video Game", 299.00, 5000, 0),
("Philips Sonicare Diamond Clean Rechargeable Toothbrush", "Beauty", 186.99, 800, 0);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Video Game", 1550.00),
("Electronics", 708.08),
("Amazon Devices", 30.00),
("Books", 10.91),
("Pet Supplies", 22.64),
("Sports & Outdoors", 8.88),
("Beauty", 367.68);