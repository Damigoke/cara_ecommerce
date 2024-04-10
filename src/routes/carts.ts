import express, { Request, Response, NextFunction } from 'express';
import { CreateOrder } from '../controller/cartController';
import { auth } from '../middleware/auth';
const router = express.Router();


router.post('/Order', CreateOrder)

export default router;