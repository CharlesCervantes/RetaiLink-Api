import express, {Router} from 'express';
import { createUser } from './controller.admin';

const adminRouter: Router = express.Router();

adminRouter.post('/create-user', (req, res) => {createUser(req, res)});

export default adminRouter;