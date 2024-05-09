import express, { Request, Response, NextFunction } from 'express';
//import { deleteProduct, CreateProduct, UpdateProduct, uploadProductImages} from '../controller/productController';
const router = express.Router();
import { createproduct, allWooCommerceProducts, updateproduct, deleteproduct, getSingleProducts } from '../controller/productController';
import { auth } from '../middleware/auth';

/* GET home page. */
router.post('/createproduct', createproduct)
router.get('/getAllproduct', allWooCommerceProducts)
router.get('/getproduct/:productId', getSingleProducts)
router.get('/update-product/:productId', updateproduct)
router.get('/delete-product/:productId', deleteproduct)

export default router;
