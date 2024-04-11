"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../config/index"));
const productModel_1 = require("./productModel");
const cartModel_1 = require("./cartModel");
const sequelize = (0, index_1.default)();
const User = sequelize.define('user', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
});
sequelize.sync({ alter: false }).then(() => {
    console.log("User model Connected");
});
//User.hasMany(Post);
User.hasMany(productModel_1.productModel, { as: 'products' });
productModel_1.productModel.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
User.hasMany(cartModel_1.cartModel, { as: 'order' });
cartModel_1.cartModel.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
exports.default = User;
