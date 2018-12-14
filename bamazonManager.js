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
let manager

function managerName() {
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        productsInTotal = res.length
    })
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "\nPlease enter your name!\n".yellow
        }
    ]).then(function(data) {
        manager = data.name
        console.log("\n\n>>>>>>>>>>>>>>>>>Hello, manager ".magenta + manager + "!<<<<<<<<<<<<<<<<<\n\n".magenta)
        start(manager)
    })
}

function start(name) {
    inquirer.prompt([
        {
            name: "choice",
            type: "rawlist",
            message: "Please choose one of the following options to continue.".yellow,
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

            // case "Add New Product" :
            //     addNew()
            //     break;
            
            case "Quit" :
                console.log("************************************************************")
                console.log("\n\nBye, " + name + "! Have a wonderful day! :)\n\n".cyan)
                console.log("************************************************************")
                connection.end();

            default:
                console.log("\n\nThere is no spoon!\n\n")
        }
    })
}

function viewProducts() {
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("-----------------------------------------------------------------------------------------------")
        console.log("ID \tPrice($) \tQuantities \tProduct")
        console.log("-----------------------------------------------------------------------------------------------")

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "\t" + res[i].price + "\t\t" + res[i].stock_quantity + "\t\t" + res[i].product_name)
        }

        console.log("-----------------------------------------------------------------------------------------------\n")
        anotherRound()
    })
}

function lowInventory() {
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        let lowUnits = false
        console.log("\n>>>>>>>>>>>>>>>>>>>>>>>Low Inventory Items<<<<<<<<<<<<<<<<<<<</n".magenta)
        console.log("-----------------------------------------------------------------------------------------------")
        console.log("ID \tPrice($) \tQuantities \tProduct")
        console.log("-----------------------------------------------------------------------------------------------")

        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                lowUnits = true
                console.log(res[i].item_id + "\t" + res[i].price + "\t\t" + res[i].stock_quantity + "\t\t" + res[i].product_name)
            }
        }

        if (!lowUnits) {     
            console.log("\n\nThere is no low inventory items!\n\n".cyan)
        }

        console.log("-----------------------------------------------------------------------------------------------\n")
        anotherRound()
    })
}

function addInventory() {
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log("-----------------------------------------------------------------------------------------------")
        console.log("ID \tPrice($) \tQuantities \tProduct")
        console.log("-----------------------------------------------------------------------------------------------")

        for (let i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "\t" + res[i].price + "\t\t" + res[i].stock_quantity + "\t\t" + res[i].product_name)
        }

        console.log("-----------------------------------------------------------------------------------------------\n")
        
        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "\nPlease select the ID of the product you would like to add more.".yellow,
                validate: function(input) {
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
                message: "\nPlease enter how many units you want to add.".yellow,
                validate: function(input) {
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
        ]).then(function(data) {
            let queryData = "SELECT * FROM products WHERE item_id=?"
            connection.query(queryData, [data.id], function(err, result) {
                if (err) throw err;
                let itemInventory = result[0].stock_quantity;
                let changedInventory = itemInventory + parseInt(data.units);
                let updateData = "UPDATE products SET ? WHERE ?"
                connection.query(updateData,
                    [
                        {
                            stock_quantity: changedInventory
                        },
                        {
                            item_id: data.id
                        }
                    ], 
                    function(err, res) {
                        if (err) throw err
                        console.log("***********************************************************************************")
                        console.log("\n\nThere are ".magenta + changedInventory + " units in inventory for ".magenta+ result[0].product_name + ".\n\n".magenta);
                        console.log("***********************************************************************************")
                        anotherRound()
                    }
                )
            })
        })
    })
}

// function addNew() {

// }

function anotherRound() {
    inquirer.prompt([
        {
            name: "execution",
            type: "confirm",
            message: "\nWould you like to see other options?\n".yellow
        }
    ]).then(function(data) {
        if (data.execution) {
            start(manager)
        } else {
            console.log("************************************************************")
            console.log("\n\nBye, ".cyan + manager + "! Have a wonderful day! :)\n\n".cyan)
            console.log("************************************************************")
            connection.end();
        }
    })
}

managerName()