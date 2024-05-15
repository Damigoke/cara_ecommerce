"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtsecret = exports.DB_URL = exports.DATABASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const woocommerce_rest_api_1 = __importDefault(require("@woocommerce/woocommerce-rest-api"));
dotenv_1.default.config();
exports.DATABASE_URL = String(process.env.DATABASE_URL);
// export const DB_NAME = String(process.env.DB_NAME);
// export const DB_HOST = String(process.env.DB_HOST);
// export const DB_USER = String(process.env.DB_USER) ;
// export const DB_PASSWORD = String(process.env.DB_PASSWORD);
exports.DB_URL = String(process.env.DB_URL);
exports.jwtsecret = process.env.JWT_SECRET;
// Create a new instance of the WooCommerce API 
const api = new woocommerce_rest_api_1.default({
    url: "https://woo-impossibly-dependable-whispers.wpcomstaging.com/",
    // Enter your api key 
    consumerKey: 'ck_e576d6900528be88b08ddda9cfb0c38a8261fc86',
    // Enter your secret given by woocommerce 
    consumerSecret: 'cs_0e83f4e256cc79c784e4dff583bddc6c7e8598e0',
    version: "wc/v3" // Set the API version 
});
exports.default = api;
