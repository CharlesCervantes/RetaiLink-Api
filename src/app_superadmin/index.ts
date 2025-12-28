import express, { Router, Request, Response } from "express";
// import { authMiddleware } from '../core/middleware/auth.middleware'
// import { actualizar_negocio, crear_negocio, eliminar_negocio, obtener_lista_negocios, obtener_negocio } from './negocios.superadmin.controller';
// import { actualizar_usuario, eliminar_usuario, login_usuario, obtener_lista_usuarios, obtener_usuario, registrar_usuario } from './usuarios.superadmin.controller';
// import { conectarEstablecimientoNegocio, createEstablecimiento, deleteEstablecimiento, desconectarEstablecimientoNegocio, getAllEstablecimientos, getEstablecimiento, updateEstablecimiento } from './establecimientos.superadmin.controller';
// import { crear_pregunta, obtener_pregunta_por_id, obtener_todas_preguntas, actualizar_pregunta, eliminar_pregunta, obtener_preguntas_por_tipo, obtener_preguntas_por_evidencia } from './preguntas.superadmin.controller';
// import { crear_pregunta_negocio, actualizar_pregunta_negocio, eliminar_pregunta_negocio, obtener_preguntas_negocio } from './preguntas_negocio.superadmin.controllers';

import { User } from "./user";
import { Client } from "./client";
import { Store } from "./store";
import { Question } from "./question";
import { IStore } from "@/core/interfaces/store";

const superAdminRouter: Router = express.Router();
const getUserModel = () => new User();
const getClientModel = () => new Client();
const getStoreModel = () => new Store();
const getQuestionModel = () => new Question();

superAdminRouter.post(
  "/register-user",
  async (req: Request, res: Response): Promise<void> => {
    let userModel: User | null = null;
    try {
      const { email, password, name, lastname } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email y password son requeridos" });
        return;
      }
      userModel = getUserModel();
      const result = await userModel.createSuperAdmin(
        email,
        password,
        name,
        lastname,
      );
      res.status(201).json({
        message: "Super admin creado correctamente",
        data: result,
      });
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error creando super admin", details: error });
    } finally {
      userModel = null;
    }
  },
);

superAdminRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    let userModel: User | null = null;
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email y password son requeridos" });
        return;
      }
      userModel = getUserModel();
      const result = await userModel.loginSuperAdmin(email, password);
      res.status(201).json({
        message: "Super admin inicio session correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error creando super admin", details: error });
    } finally {
      userModel = null;
    }
  },
);

superAdminRouter.post(
  "/create-client",
  async (req: Request, res: Response): Promise<void> => {
    let clientModel: Client | null = null;
    try {
      const { 
        id_user, 
        name,
        rfc,
        email,
        phone,
        address,
        city,
        state,
        zip,
        adiccional_notes
      } = req.body;

      if (!id_user || !name) {
        res.status(400).json({ error: "id_user y name son requeridos" });
        return;
      }

      clientModel = getClientModel();
      const result = await clientModel.createClient(id_user, name, {
        rfc,
        email,
        phone,
        address,
        city,
        state,
        zip,
        adiccional_notes
      });

      res.status(201).json({
        message: "Super admin creo cliente correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creando cliente", details: error });
    } finally {
      clientModel = null;
    }
  },
);

superAdminRouter.post(
  "/create-store",
  async (req: Request, res: Response): Promise<void> => {
    let storeModel: Store | null = null;
    try {
      const {
        id_user,
        name,
        store_code,
        street,
        ext_number,
        int_number,
        neighborhood,
        municipality,
        state,
        postal_code,
        country,
        latitude,
        longitude,
      } = req.body;

      if (!id_user || !name) {
        res.status(400).json({ error: "id_user y name son requeridos" });
        return;
      }

      storeModel = getStoreModel();
      const newStore: IStore = {
        id_store: 0,
        id_user: id_user,
        name: name,
        store_code: store_code,
        street: street,
        ext_number: ext_number,
        int_number: int_number,
        neighborhood: neighborhood,
        municipality: municipality,
        state: state,
        postal_code: postal_code,
        country: country,
        latitude: latitude,
        longitude: longitude,
        i_status: false,
        dt_register: "",
        dt_updated: "",
      };

      const result = await storeModel.createStore(id_user, newStore);
      res.status(201).json({
        message: "Super admin creo tienda correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creando tienda", details: error });
    } finally {
      storeModel = null;
    }
  },
);

superAdminRouter.post(
  "/create-question",
  async (req: Request, res: Response): Promise<void> => {
    let questionModel: Question | null = null;
    try {
      const { id_user, question, base_price, i_status, promoter_earns } =
        req.body;

      if (
        !id_user ||
        !question ||
        base_price === undefined ||
        promoter_earns === undefined
      ) {
        res.status(400).json({
          error:
            "id_user, question, base_price y promoter_earns son requeridos",
        });
        return;
      }

      questionModel = getQuestionModel();
      const newQuestion = {
        id_question: 0,
        id_user: id_user,
        question: question,
        base_price: base_price,
        promoter_earns: promoter_earns,
        i_status: i_status,
        dt_register: "",
        dt_updated: "",
      };
      const result = await questionModel.createQuestion(id_user, newQuestion);
      res.status(201).json({
        message: "Super admin creo pregunta correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creando pregunta", details: error });
    } finally {
      questionModel = null;
    }
  },
);

superAdminRouter.post(
  "/assign-question-to-client",
  async (req: Request, res: Response): Promise<void> => {
    let questionModel: Question | null = null;
    try {
      const {
        id_user,
        id_question,
        id_client,
        client_price,
        client_promoter_earns,
      } = req.body;

      if (!id_user || !id_question || !id_client) {
        res
          .status(400)
          .json({ error: "id_user, id_question y id_client son requeridos" });
        return;
      }

      questionModel = getQuestionModel();
      const result = await questionModel.asignQuestionToClient(
        id_question,
        id_client,
        id_user,
        client_price,
        client_promoter_earns,
      );
      res.status(201).json({
        message: "Super admin asigno pregunta a cliente correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error asignando pregunta a cliente", details: error });
    } finally {
      questionModel = null;
    }
  },
);

// // Negocio
// promotorRouter.post('/create-negocio', authMiddleware, (req, res) => {crear_negocio(req, res)});
// promotorRouter.get('/get-negocio/:id', authMiddleware, (req, res) => {obtener_negocio(req, res)});
// promotorRouter.get('/get-all-negocios', authMiddleware, (req, res) => {obtener_lista_negocios(req, res)});
// promotorRouter.put('/update-negocio/:id', authMiddleware, (req, res) => {actualizar_negocio(req, res)});
// promotorRouter.delete('/delete-negocio/:id', authMiddleware, (req, res) => {eliminar_negocio(req, res)});

// // Usuarios
//
// promotorRouter.post('/login-user', (req, res) => {login_usuario(req, res)});
// promotorRouter.get('/get-user/:id', authMiddleware, (req, res) => {obtener_usuario(req, res)});
// promotorRouter.get('/get-all-users', authMiddleware, (req, res) => {obtener_lista_usuarios(req, res)});
// promotorRouter.put('/update-user/:id', authMiddleware, (req, res) => {actualizar_usuario(req, res)});
// promotorRouter.delete('/delete-user/:id', authMiddleware, (req, res) => {eliminar_usuario(req, res)});

// // Establecimientos
// promotorRouter.post('/create-establecimiento', authMiddleware, (req, res) => {createEstablecimiento(req, res)});
// promotorRouter.get('/get-establecimiento/:id', authMiddleware, (req, res) => {getEstablecimiento(req, res)});
// promotorRouter.get('/get-all-establecimientos', authMiddleware, (req, res) => {getAllEstablecimientos(req, res)});
// promotorRouter.put('/update-establecimiento/:id', authMiddleware, (req, res) => {updateEstablecimiento(req, res)});
// promotorRouter.delete('/delete-establecimiento/:id', authMiddleware, (req, res) => {deleteEstablecimiento(req, res)});
// promotorRouter.post('/conectar-establecimiento-negocio', authMiddleware, (req, res) => {conectarEstablecimientoNegocio(req, res)});
// promotorRouter.post('/desconectar-establecimiento-negocio', authMiddleware, (req, res) => {desconectarEstablecimientoNegocio(req, res)});

// // Preguntas
// promotorRouter.post('/create-pregunta', authMiddleware, (req, res) => {crear_pregunta(req, res)});
// promotorRouter.get('/get-pregunta/:id', authMiddleware, (req, res) => {obtener_pregunta_por_id(req, res)});
// promotorRouter.get('/get-all-preguntas', authMiddleware, (req, res) => {obtener_todas_preguntas(req, res)});
// promotorRouter.put('/update-pregunta/:id', authMiddleware, (req, res) => {actualizar_pregunta(req, res)});
// promotorRouter.delete('/delete-pregunta/:id', authMiddleware, (req, res) => {eliminar_pregunta(req, res)});
// promotorRouter.get('/get-preguntas-por-tipo/:tipo', authMiddleware, (req, res) => {obtener_preguntas_por_tipo(req, res)});
// promotorRouter.get('/get-preguntas-por-evidencia/:evidencia', authMiddleware, (req, res) => {obtener_preguntas_por_evidencia(req, res)});

// // Preguntas Negocio
// promotorRouter.post('/create-pregunta-negocio', authMiddleware, (req, res) => {crear_pregunta_negocio(req, res)});
// promotorRouter.get('/get-preguntas-negocio/:id_negocio', authMiddleware, (req, res) => {obtener_preguntas_negocio(req, res)});
// promotorRouter.put('/update-pregunta-negocio/:id', authMiddleware, (req, res) => {actualizar_pregunta_negocio(req, res)});
// promotorRouter.delete('/delete-pregunta-negocio/:id', authMiddleware, (req, res) => {eliminar_pregunta_negocio(req, res)});

export default superAdminRouter;
