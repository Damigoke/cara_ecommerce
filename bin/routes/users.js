"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/* GET users listing. */
router.post('/register', userController_1.createUser);
router.post('/login', userController_1.loginUser);
router.get('/get-user', userController_1.getUserAndProduct);
router.delete('/delete/:id', auth_1.auth, userController_1.deleteUser);
exports.default = router;
