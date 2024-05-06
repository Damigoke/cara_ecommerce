"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { deleteProduct, CreateProduct, UpdateProduct, uploadProductImages} from '../controller/productController';
const router = express_1.default.Router();
const productController_1 = require("../controller/productController");
const auth_1 = require("../middleware/auth");
/* GET home page. */
router.get('/createproduct', auth_1.auth, productController_1.createproduct);
router.get('/getAllproduct', productController_1.allWooCommerceProducts);
router.get('/getproduct/:productId', productController_1.getSingleProducts);
router.get('/update-product/:productId', productController_1.updateproduct);
router.get('/delete-product/:productId', productController_1.deleteproduct);
exports.default = router;
