"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
function dbconnection() {
    const sslOptions = {
        rejectUnauthorized: true // Set rejectUnauthorized to true
    };
    console.log(config_1.DATABASE_URL);
    const sequelize = new sequelize_1.Sequelize(config_1.DATABASE_URL, {
        dialect: "mysql",
        dialectOptions: {
            ssl: sslOptions
        },
    });
    sequelize.authenticate()
        .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
        .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
    return sequelize;
}
exports.default = dbconnection;
