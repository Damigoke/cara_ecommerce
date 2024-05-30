import express, { Request, Response, NextFunction } from 'express';
//import { CreateOrder, getOrder, deleteOrder, deleteAllOrder } from '../controller/cartController';
import { createorder, allWooCommerceOrder, deleteorder, getsingleorder, confirmOrder, updateOrderStatus } from '../controller/cartController'
import { auth } from '../middleware/auth';
const router = express.Router();


router.post('/Order/:productIds', auth, createorder);
router.get('/get-order', auth, allWooCommerceOrder);
router.get('/get-order/:id', auth, getsingleorder);
router.get('/confirm-order/:userId', auth, confirmOrder);
router.put('/update-order-status/', auth, updateOrderStatus);
router.get('/delete-order/:productId', auth, deleteorder)
// router.delete('/delete-order', auth, deleteAllOrder)

export default router;