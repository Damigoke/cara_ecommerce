"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controller/cartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/Order', auth_1.auth, cartController_1.CreateOrder);
router.get('/get-order', auth_1.auth, cartController_1.getOrder);
router.delete('/delete-order/:id', auth_1.auth, cartController_1.deleteOrder);
router.delete('/delete-order', auth_1.auth, cartController_1.deleteAllOrder);
exports.default = router;
