import express, {Router} from 'express';

import {
    crear_producto,
    obtener_productos,
} from './productos.admin.controller'

import { crear_pedido_plantilla,obtener_pedido_plantilla,obtener_pedido_plantilla_por_id,eliminar_pedido_plantilla } from './pedido_plantilla.controller';

import { login_usuario } from './usuarios.admin.controller';

import { authMiddleware } from '../core/middleware/auth.middleware';
import { enviar_notificacion_token, enviar_notificacion_tokens, enviar_notificacion_topic } from './notificaciones.admin.controller';

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

// Notificaciones 🔔 (ejemplo: podría requerir auth)
adminRouter.post('/send-notification-token', authMiddleware, enviar_notificacion_token);
adminRouter.post('/send-notification-tokens', authMiddleware, enviar_notificacion_tokens);
adminRouter.post('/send-notification-topic', authMiddleware, enviar_notificacion_topic);


export default adminRouter;