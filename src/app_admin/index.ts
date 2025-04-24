import express, {Router} from 'express';
import { createUser, createProduct, createEstablecimineto, createTicket } from './controller.admin';

const adminRouter: Router = express.Router();

adminRouter.post('/create-user', (req, res) => {createUser(req, res)});

adminRouter.post('/create-product', (req, res) => {createProduct(req, res)});

adminRouter.post('/create-establecimiento', (req, res) => {createEstablecimineto(req, res)});

adminRouter.post('/create-ticket', (req, res) => {createTicket(req, res)});

export default adminRouter;