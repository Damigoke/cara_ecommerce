import express, { Request, Response, NextFunction } from 'express';
//import { deleteProduct, CreateProduct, UpdateProduct, uploadProductImages} from '../controller/productController';
const router = express.Router();
import { createproduct, allWooCommerceProducts, updateproduct, deleteproduct, getSingleProducts, createcategoryEndpoint, getallCategories, deleteCategoryEndpoint } from '../controller/productController';
import { auth } from '../middleware/auth';

/* GET home page. */
router.post('/createproduct', createproduct)
router.post('/createcategory', createcategoryEndpoint)
router.get('/getAllproduct', allWooCommerceProducts)
router.get('/getAllCategory', getallCategories)
router.get('/getproduct/:productId', getSingleProducts)
router.get('/update-product/:productId', updateproduct)
router.get('/delete-product/:productId', deleteproduct)
router.delete('/delete-category/:id', deleteCategoryEndpoint)

export default router;
