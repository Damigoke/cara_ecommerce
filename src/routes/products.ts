import express, { Request, Response, NextFunction } from 'express';
//import { deleteProduct, CreateProduct, UpdateProduct, uploadProductImages} from '../controller/productController';
const router = express.Router();
import { createproduct, allWooCommerceProducts, updateproduct, deleteproduct, getSingleProducts, createcategoryEndpoint, getallCategories, deleteCategoryEndpoint } from '../controller/productController';
import { adminAuth } from '../middleware/auth';

/* GET home page. */
router.post('/createproduct', adminAuth, createproduct)
router.post('/createcategory', adminAuth, createcategoryEndpoint)
router.get('/getAllproduct', allWooCommerceProducts)
router.get('/getAllCategory', getallCategories)
router.get('/getproduct/:productId',  getSingleProducts)
router.get('/update-product/:productId', adminAuth, updateproduct)
router.get('/delete-product/:productId', adminAuth, deleteproduct)
router.delete('/delete-category/:id', adminAuth, deleteCategoryEndpoint)

export default router;
