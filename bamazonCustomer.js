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

function showProducts() {
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("------------------------------------------------------------------------------")
        console.log("Item ID Price($) \tProduct")
        console.log("------------------------------------------------------------------------------")

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "\t" + res[i].price + "\t\t" + res[i].product_name)
        }

        console.log("------------------------------------------------------------------------------")

        productsInTotal = res.length
        askCustomer()
    })
}

function askCustomer() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "\nPlease select the ID of the product you would like to buy?".yellow,
            validate: function(input) {
                if (parseInt(input) <= productsInTotal) {
                    return true
                } else {
                    return false
                }
            }
        },
        {
            name: "units",
            type: "input",
            message: "\nPlease enter how many units of the product you would like to buy?".yellow,
            validate: function(input) {
                if (!isNaN(input) && parseInt(input) > 0) {
                    return true
                } else {
                    return false
                }
            }
        }
    ]).then(function(data) {
        console.log(data.id, data.units)
    })
}

showProducts()