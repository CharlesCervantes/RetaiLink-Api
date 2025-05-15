import express, {Router} from 'express';
import {
    createEstablecimiento, 
    getEstablecimiento, 
    getAllEstablecimientos, 
    updateEstablecimiento, 
    deleteEstablecimiento,

    registerUser,
    loginUser,
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,

    createNegocio,
    getNegocio,
    getAllNegocios,
    updateNegocio,
    deleteNegocio,
} from './controller.admin';
import { authMiddleware } from '@/core/middleware/auth.middleware';

const adminRouter: Router = express.Router();

// Negocio 🏪
adminRouter.post('/create-negocio', (req, res) => {createNegocio(req, res)});
adminRouter.get('/get-negocio/:id', (req, res) => {getNegocio(req, res)});
adminRouter.get('/get-all-negocios', (req, res) => {getAllNegocios(req, res)});
adminRouter.put('/update-negocio/:id', (req, res) => {updateNegocio(req, res)});
adminRouter.delete('/delete-negocio/:id', (req, res) => {deleteNegocio(req, res)});


// Usuarios 👤
adminRouter.post('/register-user', (req, res) => {registerUser(req, res)});
adminRouter.post('/login-user', (req, res) => {loginUser(req, res)});
adminRouter.get('/get-user/:id', authMiddleware, (req, res) => {getUser(req, res)});
adminRouter.get('/get-all-users', authMiddleware, (req, res) => {getAllUsers(req, res)});
adminRouter.put('/update-user/:id', authMiddleware, (req, res) => {updateUser(req, res)});
adminRouter.delete('/delete-user/:id', authMiddleware, (req, res) => {deleteUser(req, res)});


// Establecimientos 🏪
adminRouter.post('/create-establecimiento', authMiddleware, (req, res) => {createEstablecimiento(req, res)});
adminRouter.get('/get-establecimiento/:id', authMiddleware, (req, res) => {getEstablecimiento(req, res)});
adminRouter.get('/get-all-establecimientos', authMiddleware, (req, res) => {getAllEstablecimientos(req, res)});
adminRouter.put('/update-establecimiento/:id', authMiddleware, (req, res) => {updateEstablecimiento(req, res)});
adminRouter.delete('/delete-establecimiento/:id', authMiddleware, (req, res) => {deleteEstablecimiento(req, res)});

// adminRouter.post('/create-user', (req, res) => {createUser(req, res)});

// adminRouter.post('/create-product', (req, res) => {createProduct(req, res)});



// adminRouter.post('/create-ticket', (req, res) => {createTicket(req, res)});

export default adminRouter;