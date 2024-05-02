"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../config/index"));
const userModel_1 = __importDefault(require("./userModel"));
const sequelize = (0, index_1.default)();
exports.cartModel = sequelize.define('carts', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: userModel_1.default,
            key: 'id',
        },
    }
});
sequelize.sync({ alter: false }).then(() => {
    console.log("cart model Connected");
});
exports.default = exports.cartModel;
