import express, {Router} from 'express';
import { crear_promotor, login_promotor } from './promotor.mobile.controller';

const promotorRouter: Router = express.Router();

promotorRouter.post('/create-promotor', (req, res) => {crear_promotor(req, res)});
promotorRouter.post('/login', (req, res) => {login_promotor(req, res)});

export default promotorRouter;