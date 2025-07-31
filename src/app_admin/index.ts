import express, {Router} from 'express';

import {
    crear_producto,
    obtener_productos,
} from './productos.admin.controller'
import { crear_pedido_plantilla,obtener_pedido_plantilla,obtener_pedido_plantilla_por_id,eliminar_pedido_plantilla } from './pedido_plantilla.controller';
import { login_usuario } from './usuarios.admin.controller';
import {crear_establecimiento, obtener_establecimiento, obtener_todos_establecimientos, actualizar_establecimiento, eliminar_establecimiento} from './establecimientos.admin.controllers';

import { authMiddleware } from '../core/middleware/auth.middleware';
const adminRouter: Router = express.Router();

// Usuarios 👤
adminRouter.post('/login-user', (req, res) => {login_usuario(req, res)});

// Productos 🛒
adminRouter.post('/create-product', authMiddleware, (req, res) => {crear_producto(req, res)});
adminRouter.post('/get-all-products', authMiddleware, obtener_productos);

// Pedidos Plantilla 📦
adminRouter.post('/create-pedido-plantilla', authMiddleware, (req, res) => {crear_pedido_plantilla(req, res)});
adminRouter.post('/get-pedido-plantilla', authMiddleware, (req, res) => {obtener_pedido_plantilla(req, res)});
adminRouter.post('/get-pedido-plantilla-by-id', authMiddleware, (req, res) => {obtener_pedido_plantilla_por_id(req, res)});
adminRouter.post('/delete-pedido-plantilla', authMiddleware, (req, res) => {eliminar_pedido_plantilla(req, res)});

// Establecimientos 🏢
adminRouter.post('/create-establecimiento', authMiddleware, (req, res) => {crear_establecimiento(req, res)});
adminRouter.post('/get-establecimiento', authMiddleware, (req, res) => {obtener_establecimiento(req, res)});
adminRouter.post('/get-all-establecimientos', authMiddleware, obtener_todos_establecimientos);
adminRouter.put('/update-establecimiento/:id_establecimiento', authMiddleware, (req, res) => {actualizar_establecimiento(req, res)});
adminRouter.delete('/delete-establecimiento/:id_establecimiento', authMiddleware, (req, res) => {eliminar_establecimiento(req, res)});


export default adminRouter;