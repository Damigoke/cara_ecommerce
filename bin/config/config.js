"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtsecret = exports.DB_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// export const DATABASE_URL = String(process.env.DATABASE_URL)
// const connection = mysql.createConnection(DATABASE_URL)
// console.log('Connected to PlanetScale!')
// connection.end()
// export const DB_NAME = String(process.env.DB_NAME);
// export const DB_HOST = String(process.env.DB_HOST);
// export const DB_USER = String(process.env.DB_USER) ;
// export const DB_PASSWORD = String(process.env.DB_PASSWORD);
exports.DB_URL = String(process.env.DB_URL);
exports.jwtsecret = process.env.JWT_SECRET;
