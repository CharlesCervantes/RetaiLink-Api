import express, {Router} from 'express';

import { authMiddleware } from '../core/middleware/auth.middleware';

import { crear_promotor, login_promotor } from './promotor.mobile.controller';
import { obtener_cuenta_promotor, realizar_deposito_promotor, realizar_retiro_promotor } from './cuenta_promotor.mobile.controller';
import { obtener_listado_afiliacions_por_promotor } from './afiliacion.mobile.controller';

const promotorRouter: Router = express.Router();

// Verificacion de token
promotorRouter.get('/', authMiddleware, (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'Mobile Promotor API is running',
        user: req.user // devuelves el payload decodificado
    });
});

// Promotor Routes
promotorRouter.post('/create-promotor', (req, res) => {crear_promotor(req, res)});
promotorRouter.post('/login', (req, res) => {login_promotor(req, res)});

// Cuenta del promotor 🤑💵
promotorRouter.post('/cuenta', authMiddleware, (req, res) => {obtener_cuenta_promotor(req, res)});
promotorRouter.post('/cuenta/deposito', authMiddleware, (req, res) => {realizar_deposito_promotor(req, res)});
promotorRouter.post('/cuenta/retiro', authMiddleware, (req, res) => {realizar_retiro_promotor(req, res)});

// afiliaciones del promotor
promotorRouter.get('/afiliaciones/:id_promotor', authMiddleware, (req, res) => {obtener_listado_afiliacions_por_promotor(req, res)});

export default promotorRouter;