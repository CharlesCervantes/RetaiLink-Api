import express, {Router, Request, Response} from 'express';
// import { authMiddleware } from '../core/middleware/auth.middleware'
// import { actualizar_negocio, crear_negocio, eliminar_negocio, obtener_lista_negocios, obtener_negocio } from './negocios.superadmin.controller';
// import { actualizar_usuario, eliminar_usuario, login_usuario, obtener_lista_usuarios, obtener_usuario, registrar_usuario } from './usuarios.superadmin.controller';
// import { conectarEstablecimientoNegocio, createEstablecimiento, deleteEstablecimiento, desconectarEstablecimientoNegocio, getAllEstablecimientos, getEstablecimiento, updateEstablecimiento } from './establecimientos.superadmin.controller';
// import { crear_pregunta, obtener_pregunta_por_id, obtener_todas_preguntas, actualizar_pregunta, eliminar_pregunta, obtener_preguntas_por_tipo, obtener_preguntas_por_evidencia } from './preguntas.superadmin.controller';
// import { crear_pregunta_negocio, actualizar_pregunta_negocio, eliminar_pregunta_negocio, obtener_preguntas_negocio } from './preguntas_negocio.superadmin.controllers';

import { User } from './user';

const superAdminRouter: Router = express.Router();
const userModel = new User();

superAdminRouter.post("/register-user", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email y password son requeridos" });
            return;
        }
        const result = await userModel.createSuperAdmin(email, password);
        res.status(201).json({
            message: "Super admin creado correctamente",
            data: result,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Error creando super admin", details: error });
    }
});


// // Negocio 🏪
// promotorRouter.post('/create-negocio', authMiddleware, (req, res) => {crear_negocio(req, res)});
// promotorRouter.get('/get-negocio/:id', authMiddleware, (req, res) => {obtener_negocio(req, res)});
// promotorRouter.get('/get-all-negocios', authMiddleware, (req, res) => {obtener_lista_negocios(req, res)});
// promotorRouter.put('/update-negocio/:id', authMiddleware, (req, res) => {actualizar_negocio(req, res)});
// promotorRouter.delete('/delete-negocio/:id', authMiddleware, (req, res) => {eliminar_negocio(req, res)});

// // Usuarios 👤
// 
// promotorRouter.post('/login-user', (req, res) => {login_usuario(req, res)});
// promotorRouter.get('/get-user/:id', authMiddleware, (req, res) => {obtener_usuario(req, res)});
// promotorRouter.get('/get-all-users', authMiddleware, (req, res) => {obtener_lista_usuarios(req, res)});
// promotorRouter.put('/update-user/:id', authMiddleware, (req, res) => {actualizar_usuario(req, res)});
// promotorRouter.delete('/delete-user/:id', authMiddleware, (req, res) => {eliminar_usuario(req, res)});

// // Establecimientos 🏪
// promotorRouter.post('/create-establecimiento', authMiddleware, (req, res) => {createEstablecimiento(req, res)});
// promotorRouter.get('/get-establecimiento/:id', authMiddleware, (req, res) => {getEstablecimiento(req, res)});
// promotorRouter.get('/get-all-establecimientos', authMiddleware, (req, res) => {getAllEstablecimientos(req, res)});
// promotorRouter.put('/update-establecimiento/:id', authMiddleware, (req, res) => {updateEstablecimiento(req, res)});
// promotorRouter.delete('/delete-establecimiento/:id', authMiddleware, (req, res) => {deleteEstablecimiento(req, res)});
// promotorRouter.post('/conectar-establecimiento-negocio', authMiddleware, (req, res) => {conectarEstablecimientoNegocio(req, res)});
// promotorRouter.post('/desconectar-establecimiento-negocio', authMiddleware, (req, res) => {desconectarEstablecimientoNegocio(req, res)});

// // Preguntas ❓
// promotorRouter.post('/create-pregunta', authMiddleware, (req, res) => {crear_pregunta(req, res)});
// promotorRouter.get('/get-pregunta/:id', authMiddleware, (req, res) => {obtener_pregunta_por_id(req, res)});
// promotorRouter.get('/get-all-preguntas', authMiddleware, (req, res) => {obtener_todas_preguntas(req, res)});
// promotorRouter.put('/update-pregunta/:id', authMiddleware, (req, res) => {actualizar_pregunta(req, res)});
// promotorRouter.delete('/delete-pregunta/:id', authMiddleware, (req, res) => {eliminar_pregunta(req, res)});
// promotorRouter.get('/get-preguntas-por-tipo/:tipo', authMiddleware, (req, res) => {obtener_preguntas_por_tipo(req, res)});
// promotorRouter.get('/get-preguntas-por-evidencia/:evidencia', authMiddleware, (req, res) => {obtener_preguntas_por_evidencia(req, res)});

// // Preguntas Negocio ❓ 🏪
// promotorRouter.post('/create-pregunta-negocio', authMiddleware, (req, res) => {crear_pregunta_negocio(req, res)});
// promotorRouter.get('/get-preguntas-negocio/:id_negocio', authMiddleware, (req, res) => {obtener_preguntas_negocio(req, res)});
// promotorRouter.put('/update-pregunta-negocio/:id', authMiddleware, (req, res) => {actualizar_pregunta_negocio(req, res)});
// promotorRouter.delete('/delete-pregunta-negocio/:id', authMiddleware, (req, res) => {eliminar_pregunta_negocio(req, res)});

export default superAdminRouter;