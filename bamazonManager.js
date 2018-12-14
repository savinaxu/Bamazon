const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

let productsInTotal

function choose() {
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        productsInTotal = res.length
    })

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "\nPlease enter your name!\n"
        }
    ]).then(function(data) {
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                message: "Hello, manager " + data.name + "! Select one of the following options to  continue.",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
            }
        ]).then(function(data) {
            let managerChoice = data.choice

            switch (managerChoice) {
                case "View Products for Sale" :
                    viewProducts()
                    break;

                case "View Low Inventory" :
                    lowInventory()
                    break;
                
                case "Add to Inventory" :
                    addInventory()
                    break;

                case "Add New Product" :
                    addNew()
                    break;
                
                case "Quit" :
                    connection.end();

                default
            }
        })
    })
}

choose()