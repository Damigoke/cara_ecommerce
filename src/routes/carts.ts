import express, { Request, Response, NextFunction } from 'express';
//import { CreateOrder, getOrder, deleteOrder, deleteAllOrder } from '../controller/cartController';
import { createorder, allWooCommerceOrder, deleteorder, getsingleorder } from '../controller/cartController'
import { auth } from '../middleware/auth';
const router = express.Router();


router.post('/Order/:productIds', auth, createorder);
router.get('/get-order', allWooCommerceOrder);
router.get('/get-order/:id', auth, getsingleorder);
router.get('/delete-order/:productId', auth, deleteorder)
// router.delete('/delete-order', auth, deleteAllOrder)

export default router;