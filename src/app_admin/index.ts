import express, {Router} from 'express';
import {
    createEstablecimiento, 
    getEstablecimiento, 
    getAllEstablecimientos, 
    updateEstablecimiento, 
    deleteEstablecimiento,
    conectarEstablecimientoNegocio,
    desconectarEstablecimientoNegocio,
    createNegocio,
    getNegocio,
    getAllNegocios,
    updateNegocio,
    deleteNegocio,
} from './controller.admin';

import {
    actualizar_usuario,
    eliminar_usuario,
    login_usuario,
    obtener_lista_usuarios,
    obtener_usuario,
    registrar_usuario
} from './usuarios.admin.controller';

import { authMiddleware } from '../core/middleware/auth.middleware';

const adminRouter: Router = express.Router();

// Negocio 🏪
adminRouter.post('/create-negocio', (req, res) => {createNegocio(req, res)});
adminRouter.get('/get-negocio/:id', (req, res) => {getNegocio(req, res)});
adminRouter.get('/get-all-negocios', (req, res) => {getAllNegocios(req, res)});
adminRouter.put('/update-negocio/:id', (req, res) => {updateNegocio(req, res)});
adminRouter.delete('/delete-negocio/:id', (req, res) => {deleteNegocio(req, res)});


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

// adminRouter.post('/create-user', (req, res) => {createUser(req, res)});

// adminRouter.post('/create-product', (req, res) => {createProduct(req, res)});



// adminRouter.post('/create-ticket', (req, res) => {createTicket(req, res)});

export default adminRouter;