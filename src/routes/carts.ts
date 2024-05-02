import express, { Request, Response, NextFunction } from 'express';
//import { CreateOrder, getOrder, deleteOrder, deleteAllOrder } from '../controller/cartController';
import { createorder, allWooCommerceOrder, deleteorder } from '../controller/cartController'
import { auth } from '../middleware/auth';
const router = express.Router();


router.get('/Order/:productIds', auth, createorder);
router.get('/get-order', auth, allWooCommerceOrder);
router.get('/delete-order/:productId', auth, deleteorder)
// router.delete('/delete-order', auth, deleteAllOrder)

export default router;