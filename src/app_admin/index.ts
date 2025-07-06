import express, {Router} from 'express';
import {
    createEstablecimiento, 
    getEstablecimiento, 
    getAllEstablecimientos, 
    updateEstablecimiento, 
    deleteEstablecimiento,
    conectarEstablecimientoNegocio,
    desconectarEstablecimientoNegocio,
} from './controller.admin';

import {
    actualizar_usuario,
    eliminar_usuario,
    login_usuario,
    obtener_lista_usuarios,
    obtener_usuario,
    registrar_usuario
} from './usuarios.admin.controller';

import { 
    crear_negocio,
    obtener_negocio,
    obtener_lista_negocios,
    actualizar_negocio,
    eliminar_negocio
} from './negocios.admin.controller';

import {
    crear_producto,
    obtener_productos,
} from './productos.admin.controller'

import { authMiddleware } from '../core/middleware/auth.middleware';

const adminRouter: Router = express.Router();

// Negocio 🏪
adminRouter.post('/create-negocio', (req, res) => {crear_negocio(req, res)});
adminRouter.get('/get-negocio/:id', (req, res) => {obtener_negocio(req, res)});
adminRouter.get('/get-all-negocios', (req, res) => {obtener_lista_negocios(req, res)});
adminRouter.put('/update-negocio/:id', (req, res) => {actualizar_negocio(req, res)});
adminRouter.delete('/delete-negocio/:id', (req, res) => {eliminar_negocio(req, res)});


// Usuarios 👤
adminRouter.post('/register-user', (req, res) => {registrar_usuario(req, res)});
adminRouter.post('/login-user', (req, res) => {login_usuario(req, res)});
adminRouter.get('/get-user/:id', authMiddleware, (req, res) => {obtener_usuario(req, res)});
adminRouter.get('/get-all-users', authMiddleware, (req, res) => {obtener_lista_usuarios(req, res)});
adminRouter.put('/update-user/:id', authMiddleware, (req, res) => {actualizar_usuario(req, res)});
adminRouter.delete('/delete-user/:id', authMiddleware, (req, res) => {eliminar_usuario(req, res)});


// Establecimientos 🏪
adminRouter.post('/create-establecimiento', authMiddleware, (req, res) => {createEstablecimiento(req, res)});
adminRouter.get('/get-establecimiento/:id', authMiddleware, (req, res) => {getEstablecimiento(req, res)});
adminRouter.get('/get-all-establecimientos', authMiddleware, (req, res) => {getAllEstablecimientos(req, res)});
adminRouter.put('/update-establecimiento/:id', authMiddleware, (req, res) => {updateEstablecimiento(req, res)});
adminRouter.delete('/delete-establecimiento/:id', authMiddleware, (req, res) => {deleteEstablecimiento(req, res)});
adminRouter.post('/conectar-establecimiento-negocio', authMiddleware, (req, res) => {conectarEstablecimientoNegocio(req, res)});
adminRouter.post('/desconectar-establecimiento-negocio', authMiddleware, (req, res) => {desconectarEstablecimientoNegocio(req, res)});

// Productos 🛒
adminRouter.post('/create-product', authMiddleware, (req, res) => {crear_producto(req, res)});
adminRouter.get('/get-all-products', authMiddleware, obtener_productos);


export default adminRouter;