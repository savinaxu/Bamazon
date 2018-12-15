const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const {table} = require('table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

let data,
    output,
    supervisor;

function supervisorName() {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "\nPlease enter your name!\n".yellow
    }]).then(function (answer) {
        supervisor = answer.name
        console.log("\n\n>>>>>>>>>>>>>>>>>Hello, supervisor ".magenta + supervisor + "!<<<<<<<<<<<<<<<<<\n\n".magenta)
        choice(supervisor)
    })
}

function choice(name) {
    inquirer.prompt([
        {
            name: "option",
            type: "rawlist",
            message: "Please choose one of the following options to continue.".yellow,
            choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
    ]).then(function(answer) {
        let option = answer.option

        if (option === "View Product Sales by Department") {
            viewSales()
        } else if (option === "Create New Department") {
            newDepart()
        } else {
            console.log("************************************************************")
            console.log("\n\nBye, ".cyan + name + "! Have a wonderful day! :)\n\n".cyan)
            console.log("************************************************************")
            connection.end();
        }
    });
}

function viewSales() {
    let query = `SELECT department_id,
    departments.department_name,
    over_head_costs,
    SUM(products.product_sales) as Sum_sales 
    FROM departments
    LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_id`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        data = [['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit']];

        for (let i=0; i<res.length; i++) {
            let id = res[i].department_id,
                departmentName = res[i].department_name,
                overHeadCosts = parseInt(res[i].over_head_costs),
                sum = parseInt(res[i].Sum_sales),
                profit = parseInt((sum- overHeadCosts).toFixed(2))

            let row = [id, departmentName, overHeadCosts, sum, profit];
            data.push(row);
        }
        output = table(data);
        console.log(output);
        choice(supervisor);
    });
}

function newDepart() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "\nWhat's the name of the new department?".yellow
        },
        {
            type: "input",
            name: "costs",
            message: "\nHow much is the overhead costs of the new department?".yellow,
            validate: function(input) {
                if (!isNaN(input)) {
                    return true
                } else {
                    console.log("\n*****************************".cyan);
                    console.log("*Please enter a valid amount.*".cyan);
                    console.log("*******************************\n".cyan);
                    return false
                }
            }
        }
    ]).then(function(answer) {
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: answer.name,
                over_head_costs: answer.costs
            },
            function(err) {
                if (err) throw err;
                console.log("*******************************************");
                console.log("\n\nYour new department has been added.\n\n".magenta);
                console.log("*******************************************");
                choice(supervisor);
            }
        );
    });
}

supervisorName()