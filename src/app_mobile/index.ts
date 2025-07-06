import express, {Router} from 'express';

import { authMiddleware } from '../core/middleware/auth.middleware';

import { crear_promotor, login_promotor } from './promotor.mobile.controller';
import { obtener_cuenta_promotor, realizar_deposito_promotor } from './cuenta_promotor.mobile.controller';

const promotorRouter: Router = express.Router();

// Promotor Routes
promotorRouter.post('/create-promotor', (req, res) => {crear_promotor(req, res)});
promotorRouter.post('/login', (req, res) => {login_promotor(req, res)});

// Cuenta del promotor 🤑💵
promotorRouter.post('/cuenta', authMiddleware, (req, res) => {obtener_cuenta_promotor(req, res)});
promotorRouter.post('/cuenta/deposito', authMiddleware, (req, res) => {realizar_deposito_promotor(req, res)});


export default promotorRouter;