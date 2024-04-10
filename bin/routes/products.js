"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
/* GET home page. */
router.post('/createproduct', auth_1.auth, productController_1.uploadProductImages, productController_1.CreateProduct);
router.get('/getproduct', productController_1.getProduct);
router.put('/update-product/:id', auth_1.auth, productController_1.UpdateProduct);
router.delete('/delete-product/:id', auth_1.auth, productController_1.deleteProduct);
router.delete('/delete-product', auth_1.auth, productController_1.deleteAllProduct);
exports.default = router;
