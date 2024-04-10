"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../config/index"));
const sequelize = (0, index_1.default)();
exports.cartModel = sequelize.define('carts', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    size: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID
    }
});
sequelize.sync({ alter: false }).then(() => {
    console.log("cart model Connected");
});
exports.default = exports.cartModel;
