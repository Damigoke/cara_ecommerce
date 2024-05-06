"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { CreateOrder, getOrder, deleteOrder, deleteAllOrder } from '../controller/cartController';
const cartController_1 = require("../controller/cartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/Order/:productIds', auth_1.auth, cartController_1.createorder);
router.get('/get-order', auth_1.auth, cartController_1.allWooCommerceOrder);
router.get('/get-order/:id', auth_1.auth, cartController_1.getsingleorder);
router.get('/delete-order/:productId', auth_1.auth, cartController_1.deleteorder);
// router.delete('/delete-order', auth, deleteAllOrder)
exports.default = router;
