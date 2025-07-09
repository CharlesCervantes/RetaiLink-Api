import express, {Router} from 'express';

import {
    crear_producto,
    obtener_productos,
} from './productos.admin.controller'

import { authMiddleware } from '../core/middleware/auth.middleware';

const adminRouter: Router = express.Router();

// Productos 🛒
adminRouter.post('/create-product', authMiddleware, (req, res) => {crear_producto(req, res)});
adminRouter.post('/get-all-products', authMiddleware, obtener_productos);


export default adminRouter;