import express, { Request, Response, NextFunction } from 'express';
import { deleteProduct, getProduct, CreateProduct, UpdateProduct, deleteAllProduct, uploadProductImages} from '../controller/productController';
const router = express.Router();
import { auth } from '../middleware/auth';

/* GET home page. */
router.post('/createproduct', auth, uploadProductImages, CreateProduct)
router.get('/getproduct', getProduct)
router.put('/update-product/:id',auth, UpdateProduct)
router.delete('/delete-product/:id', auth, deleteProduct)
router.delete('/delete-product',auth, deleteAllProduct)

export default router;
