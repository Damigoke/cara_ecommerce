"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentType = exports.auth = exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const config_1 = require("../config/config");
const path_1 = __importDefault(require("path"));
async function adminAuth(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ error: 'Kindly Log in as a User' });
        }
        const token = authorization?.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.jwtsecret);
        if (!verified) {
            return res.status(401).send({ error: "Token not available on this route" });
        }
        const { id, role } = verified; // Assuming the role is included in the JWT payload
        // Find user by id
        const user = await userModel_1.default.findOne({ where: { id } });
        if (user && role !== 'admin') {
            return res.status(401).json({ Error: "Kindly login correct details as a user" });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(400).send("User not Logged in");
    }
}
exports.adminAuth = adminAuth;
async function auth(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({ error: 'Kindly Log in as a User' });
        }
        const token = authorization?.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.jwtsecret);
        if (!verified) {
            return res.status(401).send({ error: "Token not available on this route" });
        }
        const { id } = verified; // Assuming the role is included in the JWT payload
        // Find user by id
        const user = await userModel_1.default.findOne({ where: { id } });
        if (!user) {
            return res.status(401).json({ Error: "Kindly login correct details as a user" });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(400).send("User not Logged in");
    }
}
exports.auth = auth;
function getContentType(filePath) {
    const ext = path_1.default.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}
exports.getContentType = getContentType;
