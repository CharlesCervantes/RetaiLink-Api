import express, {Router} from 'express';

import {
    crear_producto,
    obtener_productos,
} from './productos.admin.controller'

import { login_usuario } from './usuarios.admin.controller';

import { authMiddleware } from '../core/middleware/auth.middleware';

const adminRouter: Router = express.Router();

// Usuarios 👤
adminRouter.post('/login-user', (req, res) => {login_usuario(req, res)});

// Productos 🛒
adminRouter.post('/create-product', authMiddleware, (req, res) => {crear_producto(req, res)});
adminRouter.post('/get-all-products', authMiddleware, obtener_productos);


export default adminRouter;