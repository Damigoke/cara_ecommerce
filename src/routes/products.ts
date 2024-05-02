import express, { Request, Response, NextFunction } from 'express';
//import { deleteProduct, CreateProduct, UpdateProduct, uploadProductImages} from '../controller/productController';
const router = express.Router();
import { createproduct, allWooCommerceProducts, updateproduct, deleteproduct } from '../controller/productController';
import { auth } from '../middleware/auth';

/* GET home page. */
router.get('/createproduct', auth, createproduct)
router.get('/getproduct', allWooCommerceProducts)
router.get('/update-product/:productId', updateproduct)
router.get('/delete-product/:productId', deleteproduct)

export default router;
