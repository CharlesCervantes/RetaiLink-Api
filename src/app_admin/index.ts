import express, {Router} from 'express';

import {
    crear_producto,
    obtener_productos,
} from './productos.admin.controller'
import { crear_pedido_plantilla,obtener_pedido_plantilla,obtener_pedido_plantilla_por_id,eliminar_pedido_plantilla } from './pedido_plantilla.controller';
import { login_usuario, obtener_usuarios_negocio, registrar_usuario_negocio } from './usuarios.admin.controller';
import {crear_establecimiento, obtener_establecimiento, obtener_todos_establecimientos, actualizar_establecimiento, eliminar_establecimiento} from './establecimientos.admin.controllers';

import { authMiddleware } from '../core/middleware/auth.middleware';
import { enviar_notificacion_token, enviar_notificacion_tokens, enviar_notificacion_topic } from './notificaciones.admin.controller';

const adminRouter: Router = express.Router();

// Usuarios 👤
adminRouter.post('/login-user', (req, res) => {login_usuario(req, res)});
adminRouter.post('/get-users-by-business', authMiddleware, (req, res) => {obtener_usuarios_negocio(req, res)});
adminRouter.post('/register-user-by-buisness', authMiddleware, (req, res) => {registrar_usuario_negocio(req, res)});

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
adminRouter.post('/get-all-establecimientos', authMiddleware, (req, res) => {obtener_todos_establecimientos(req, res)});
adminRouter.put('/update-establecimiento/:id_establecimiento', authMiddleware, (req, res) => {actualizar_establecimiento(req, res)});
adminRouter.delete('/delete-establecimiento/:id_establecimiento', authMiddleware, (req, res) => {eliminar_establecimiento(req, res)});

// Notificaciones 🔔 (ejemplo: podría requerir auth)
adminRouter.post('/send-notification-token', authMiddleware, enviar_notificacion_token);
adminRouter.post('/send-notification-tokens', authMiddleware, enviar_notificacion_tokens);
adminRouter.post('/send-notification-topic', authMiddleware, enviar_notificacion_topic);


export default adminRouter;