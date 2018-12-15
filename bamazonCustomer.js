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
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("------------------------------------------------------------------------------")
        console.log("ID \tPrice($) \tProduct")
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
    inquirer.prompt([{
            name: "id",
            type: "input",
            message: "\nPlease select the ID of the product you would like to buy?".yellow,
            validate: function (input) {
                if (parseInt(input) <= productsInTotal) {
                    return true
                } else {
                    console.log("\n\n*************************".cyan);
                    console.log("*Please enter a valid id*".cyan);
                    console.log("*************************\n\n".cyan);
                    return false
                }
            }
        },
        {
            name: "units",
            type: "input",
            message: "\nPlease enter how many units of the product you would like to buy?".yellow,
            validate: function (input) {
                if (!isNaN(input) && parseInt(input) > 0) {
                    return true
                } else {
                    console.log("\n\n*********************************".cyan);
                    console.log("*Please enter a valid quantity.*".cyan);
                    console.log("*********************************\n\n".cyan);
                    return false
                }
            }
        }
    ]).then(function (data) {
        let queryData = "SELECT * FROM products WHERE item_id=?"

        connection.query(queryData, [data.id], function (err, result) {
            if (err) throw err;
            let itemInventory = result[0].stock_quantity;
            let itemPrice = result[0].price;
            let changedInventory = itemInventory - parseInt(data.units);
            let totalCost = (parseInt(data.units) * itemPrice).toFixed(2);


            if (changedInventory >= 0) {
                console.log("***************************************")
                console.log("\n\nYour total costs is $ ".magenta + totalCost + " !\n\n".magenta)
                console.log("***************************************")
                let updateData = "UPDATE products SET ? WHERE ?"
                connection.query(updateData,
                    [{
                            stock_quantity: changedInventory
                        },
                        {
                            item_id: data.id
                        }
                    ],
                    function (err, res) {
                        return
                    }
                )
                anotherAsk()
            } else {
                console.log("*****************************".rainbow)
                console.log("\n\nSorry, insufficient quantity!\n\n".rainbow)
                console.log("*****************************".rainbow)
                anotherAsk()
            }
        })
    })

    function anotherAsk() {
        inquirer.prompt([{
            name: "buy",
            type: "confirm",
            message: "\nWould you like to order another item?\n".yellow
        }]).then(function (data) {
            if (data.buy) {
                showProducts()
            } else {
                console.log("*************************************************************************")
                console.log("\n\nThank you for shopping with us! Looking forward to seeing you next time!\n\n".cyan)
                console.log("*************************************************************************")
                connection.end()
            }
        })
    }
}

showProducts()