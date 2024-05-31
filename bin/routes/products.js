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
router.post('/createproduct', auth_1.adminAuth, productController_1.createproduct);
router.post('/createcategory', auth_1.adminAuth, productController_1.createcategoryEndpoint);
router.get('/getAllproduct', productController_1.allWooCommerceProducts);
router.get('/getAllCategory', auth_1.adminAuth, productController_1.getallCategories);
router.get('/getproduct/:productId', productController_1.getSingleProducts);
router.get('/update-product/:productId', auth_1.adminAuth, productController_1.updateproduct);
router.get('/delete-product/:productId', auth_1.adminAuth, productController_1.deleteproduct);
router.delete('/delete-category/:id', auth_1.adminAuth, productController_1.deleteCategoryEndpoint);
exports.default = router;
