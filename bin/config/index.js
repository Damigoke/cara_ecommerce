"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
function dbconnection() {
    const sslOptions = {
        rejectUnauthorized: false // Set rejectUnauthorized to true
    };
    const sequelize = new sequelize_1.Sequelize(config_1.DB_URL, {
        dialect: "mysql",
        dialectOptions: {
            ssl: sslOptions
        },
        // timezone: '+00:00',
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
