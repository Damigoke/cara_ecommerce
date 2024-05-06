"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../config/index"));
const cartModel_1 = require("./cartModel");
const sequelize = (0, index_1.default)();
exports.productModel = sequelize.define('products', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
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
    console.log("poduct model Connected");
});
exports.productModel.hasMany(cartModel_1.cartModel);
cartModel_1.cartModel.belongsTo(exports.productModel, { foreignKey: 'productId', targetKey: 'id' });
