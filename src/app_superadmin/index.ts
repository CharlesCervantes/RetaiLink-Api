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

superAdminRouter.post("/stores", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_user, name, ...storeData } = req.body;

    if (!id_user || !name) {
      res.status(400).json({ error: "id_user y name son requeridos" });
      return;
    }

    const storeModel = getStoreModel();
    const result = await storeModel.createStore(id_user, { name, ...storeData } as IStore);

    res.status(201).json({
      message: "Tienda creada exitosamente",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error creando tienda",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

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

superAdminRouter.get("/get_clients_list", async (_req: Request, res: Response): Promise<void> => {
    let clientModel: Client | null = null;
    try {
      clientModel = getClientModel();
      const result = await clientModel.getClients();
      res.status(200).json({
        message: "Lista de clientes obtenida correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error obteniendo lista de clientes", details: error });
    } finally {
      clientModel = null;
    }
  },
);

superAdminRouter.get("/get_client/:id", async (req: Request, res: Response): Promise<void> => {
    let clientModel: Client | null = null;
    try {
      clientModel = getClientModel();
      const result = await clientModel.getClientById(parseInt(req.params.id));
      res.status(200).json({
        message: "Cliente obtenido correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error obteniendo cliente", details: error });
    } finally {
      clientModel = null;
    }
  },
);

// Obtener todas las tiendas
superAdminRouter.get("/stores", async (_req: Request, res: Response): Promise<void> => {
  try {
    const storeModel = getStoreModel();
    const stores = await storeModel.getStores();

    res.status(200).json({
      message: "Tiendas obtenidas exitosamente",
      data: stores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo tiendas",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Obtener tienda por ID
superAdminRouter.get("/stores/:id_store", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_store } = req.params;

    const storeModel = getStoreModel();
    const store = await storeModel.getStoreById(Number(id_store));

    if (!store) {
      res.status(404).json({ error: "Tienda no encontrada" });
      return;
    }

    res.status(200).json({
      message: "Tienda obtenida exitosamente",
      data: store,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo tienda",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Actualizar tienda
superAdminRouter.put("/stores/:id_store", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_store } = req.params;
    const { id_user, ...updateData } = req.body;

    if (!id_user) {
      res.status(400).json({ error: "id_user es requerido" });
      return;
    }

    const storeModel = getStoreModel();
    const result = await storeModel.updateStore(Number(id_store), id_user, updateData);

    res.status(200).json({
      message: result.message,
      success: result.success,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error actualizando tienda",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Eliminar tienda (soft delete)
superAdminRouter.delete("/stores/:id_store", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_store } = req.params;
    const { id_user } = req.body;

    if (!id_user) {
      res.status(400).json({ error: "id_user es requerido" });
      return;
    }

    const storeModel = getStoreModel();
    const result = await storeModel.deleteStore(Number(id_store), id_user);

    res.status(200).json({
      message: result.message,
      success: result.success,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error eliminando tienda",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

superAdminRouter.post("/stores/:id_store/clients/:id_client", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_store, id_client } = req.params;
    const { id_user_creator } = req.body;

    if (!id_user_creator) {
      res.status(400).json({ error: "id_user_creator es requerido" });
      return;
    }

    const storeModel = getStoreModel();
    const result = await storeModel.assignStoreToClient(
      Number(id_store),
      Number(id_client),
      id_user_creator
    );

    res.status(201).json({
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error asignando tienda al cliente",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Desasignar tienda de cliente
superAdminRouter.delete("/stores/:id_store/clients/:id_client", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_store, id_client } = req.params;

    const storeModel = getStoreModel();
    const result = await storeModel.removeStoreFromClient(Number(id_store), Number(id_client));

    res.status(200).json({
      message: result.message,
      success: result.success,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error desasignando tienda del cliente",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Obtener tiendas de un cliente
superAdminRouter.get("/stores/clients/:id_client", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_client } = req.params;

    const storeModel = getStoreModel();
    const stores = await storeModel.getStoresByClient(Number(id_client));

    res.status(200).json({
      message: "Tiendas del cliente obtenidas exitosamente",
      data: stores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo tiendas del cliente",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Obtener clientes de una tienda
superAdminRouter.get("/stores/:id_store/clients/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_store } = req.params;

    const storeModel = getStoreModel();
    const clients = await storeModel.getClientsByStore(Number(id_store));

    res.status(200).json({
      message: "Clientes de la tienda obtenidos exitosamente",
      data: clients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo clientes de la tienda",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Obtener tiendas disponibles para asignar a un cliente
superAdminRouter.get("/stores/clients/available-stores/:id_client", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_client } = req.params;

    const storeModel = getStoreModel();
    const stores = await storeModel.getAvailableStoresForClient(Number(id_client));

    res.status(200).json({
      message: "Tiendas disponibles obtenidas exitosamente",
      data: stores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo tiendas disponibles",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export default superAdminRouter;
