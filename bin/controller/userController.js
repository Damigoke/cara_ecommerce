"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAndProduct = exports.deleteUser = exports.loginUser = exports.createUser = void 0;
const uuid_1 = require("uuid");
const userModel_1 = __importDefault(require("../model/userModel"));
const utill_1 = require("../utill/utill");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const productModel_1 = require("../model/productModel");
async function createUser(req, res) {
    try {
        const { first_name, last_name, email, password, confirmed_password } = req.body;
        const idv4 = (0, uuid_1.v4)();
        const resultValidation = utill_1.registerUserSchema.validate(req.body, utill_1.alternative);
        if (resultValidation.error) {
            return res.status(500).json({ error: resultValidation.error.details[0].message });
        }
        if (confirmed_password !== password) {
            return res.status(500).json({ error: "Password does not match" });
        }
        const hashPassword = await bcrypt_1.default.hash(password, 8);
        const user = await userModel_1.default.findOne({ where: { email: email } });
        if (!user) {
            const newUser = await userModel_1.default.create({ id: idv4, first_name, last_name, email, password: hashPassword });
            return res.status(200).json({ message: "User Created Successfully", data: newUser });
        }
        return res.status(400).json({ error: 'Email is already taken' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    ;
}
exports.createUser = createUser;
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const resultValidation = utill_1.loginUserSchema.validate(req.body, utill_1.alternative);
        if (resultValidation.error) {
            return res.status(400).json({ error: resultValidation.error.details[0].message });
        }
        const user = await userModel_1.default.findOne({
            where: { email: email }
        });
        let token = "";
        if (user.email === 'fopefaokunla@gmail.com') {
            const id = user.id;
            token = jsonwebtoken_1.default.sign({ id, role: 'admin' }, config_1.jwtsecret, { expiresIn: '1h' });
        }
        else {
            const id = user.id;
            token = jsonwebtoken_1.default.sign({ id }, config_1.jwtsecret, { expiresIn: '1h' });
        }
        const loginValidation = await bcrypt_1.default.compare(password, user.password);
        if (loginValidation) {
            return res.status(200).json({ data: user, token, success: true });
        }
        res.status(400).json({ error: "Invalid email/password" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal server error", success: false });
    }
    ;
}
exports.loginUser = loginUser;
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const user = await userModel_1.default.findOne({
            where: { id }
        });
        if (!user) {
            return res.status(400).json({
                msg: "Cannot find the user"
            });
        }
        const deleteUser = await user.destroy();
        return res.status(200).json({ data: deleteUser, msg: "You have successfully deleted the product", success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
}
exports.deleteUser = deleteUser;
async function getUserAndProduct(req, res) {
    try {
        const users = await userModel_1.default.findAndCountAll({
            include: [
                {
                    model: productModel_1.productModel,
                    as: 'products'
                }
            ]
        });
        return res.status(200).json({
            data: users,
            count: users.count,
            success: true
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Internal server error", success: false });
    }
}
exports.getUserAndProduct = getUserAndProduct;
