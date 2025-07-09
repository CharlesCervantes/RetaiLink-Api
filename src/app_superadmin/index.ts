import express, {Router} from 'express';
import { authMiddleware } from '../core/middleware/auth.middleware'
import { actualizar_negocio, crear_negocio, eliminar_negocio, obtener_lista_negocios, obtener_negocio } from './negocios.superadmin.controller';
import { actualizar_usuario, eliminar_usuario, login_usuario, obtener_lista_usuarios, obtener_usuario, registrar_usuario } from './usuarios.superadmin.controller';
import { conectarEstablecimientoNegocio, createEstablecimiento, deleteEstablecimiento, desconectarEstablecimientoNegocio, getAllEstablecimientos, getEstablecimiento, updateEstablecimiento } from './establecimientos.superadmin.controller';

const promotorRouter: Router = express.Router();

promotorRouter.get('/', (_req, res) => {
    res.status(200).json({
        ok: true,
        message: 'Superadmin API is running'
    });
});

// Negocio 🏪
promotorRouter.post('/create-negocio', authMiddleware, (req, res) => {crear_negocio(req, res)});
promotorRouter.get('/get-negocio/:id', authMiddleware, (req, res) => {obtener_negocio(req, res)});
promotorRouter.get('/get-all-negocios', authMiddleware, (req, res) => {obtener_lista_negocios(req, res)});
promotorRouter.put('/update-negocio/:id', authMiddleware, (req, res) => {actualizar_negocio(req, res)});
promotorRouter.delete('/delete-negocio/:id', authMiddleware, (req, res) => {eliminar_negocio(req, res)});

// Usuarios 👤
promotorRouter.post('/register-user', (req, res) => {registrar_usuario(req, res)});
promotorRouter.post('/login-user', (req, res) => {login_usuario(req, res)});
promotorRouter.get('/get-user/:id', authMiddleware, (req, res) => {obtener_usuario(req, res)});
promotorRouter.get('/get-all-users', authMiddleware, (req, res) => {obtener_lista_usuarios(req, res)});
promotorRouter.put('/update-user/:id', authMiddleware, (req, res) => {actualizar_usuario(req, res)});
promotorRouter.delete('/delete-user/:id', authMiddleware, (req, res) => {eliminar_usuario(req, res)});

// Establecimientos 🏪
promotorRouter.post('/create-establecimiento', authMiddleware, (req, res) => {createEstablecimiento(req, res)});
promotorRouter.get('/get-establecimiento/:id', authMiddleware, (req, res) => {getEstablecimiento(req, res)});
promotorRouter.get('/get-all-establecimientos', authMiddleware, (req, res) => {getAllEstablecimientos(req, res)});
promotorRouter.put('/update-establecimiento/:id', authMiddleware, (req, res) => {updateEstablecimiento(req, res)});
promotorRouter.delete('/delete-establecimiento/:id', authMiddleware, (req, res) => {deleteEstablecimiento(req, res)});
promotorRouter.post('/conectar-establecimiento-negocio', authMiddleware, (req, res) => {conectarEstablecimientoNegocio(req, res)});
promotorRouter.post('/desconectar-establecimiento-negocio', authMiddleware, (req, res) => {desconectarEstablecimientoNegocio(req, res)});

export default promotorRouter;