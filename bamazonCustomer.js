const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "products"
});

function showProducts() {
    const query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function(err, res) {
        
    })
}