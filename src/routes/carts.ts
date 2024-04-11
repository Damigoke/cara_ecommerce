import express, { Request, Response, NextFunction } from 'express';
import { CreateOrder, getOrder, deleteOrder, deleteAllOrder } from '../controller/cartController';
import { auth } from '../middleware/auth';
const router = express.Router();


router.post('/Order', auth, CreateOrder);
router.get('/get-order', auth, getOrder);
router.delete('/delete-order/:id', auth, deleteOrder)
router.delete('/delete-order', auth, deleteAllOrder)

export default router;