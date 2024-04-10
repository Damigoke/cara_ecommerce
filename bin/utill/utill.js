"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = exports.updateProductSchema = exports.createProductSchema = exports.loginUserSchema = exports.alternative = exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerUserSchema = joi_1.default.object().keys({
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[A-Za-z0-5]{2,8}$/).required(),
    confirmed_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('confirm password').messages({ 'any.only': '{{#label}} does not match' })
});
exports.alternative = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
exports.loginUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
});
exports.createProductSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().required(),
    Image: joi_1.default.string().trim().required(),
    brand: joi_1.default.string().trim().required(),
    category: joi_1.default.string().trim().required(),
    description: joi_1.default.string().trim().required(),
    price: joi_1.default.number().required(),
});
exports.updateProductSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().required(),
    Image: joi_1.default.string().trim().required(),
    brand: joi_1.default.string().trim().required(),
    category: joi_1.default.string().trim().required(),
    description: joi_1.default.string().trim().required(),
    price: joi_1.default.number().required(),
});
exports.createOrderSchema = joi_1.default.object().keys({
    size: joi_1.default.string().trim().required(),
    price: joi_1.default.number().required(),
});
