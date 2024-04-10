import express, { Request, Response, NextFunction } from 'express';
import { createUser, loginUser, deleteUser, getUserAndProduct } from '../controller/userController';
import { auth } from '../middleware/auth';
const router = express.Router();

/* GET users listing. */
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/get-user', getUserAndProduct)
router.delete('/delete/:id', auth, deleteUser);

export default router;
