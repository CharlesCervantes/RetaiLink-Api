import express, {Router} from 'express';
import { 
    createEstablecimiento, 
    getEstablecimiento, 
    getAllEstablecimientos, 
    updateEstablecimiento, 
    deleteEstablecimiento 
} from './controller.admin';
import { authMiddleware } from '@/core/middleware/auth.middleware';

const adminRouter: Router = express.Router();

// Usuarios 👤


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