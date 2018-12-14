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