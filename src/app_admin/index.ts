import express, { Router, Request, Response } from "express";

import { UserAdmin } from "./userAdmin";
import { productAdmin } from "./productAdmin"

import { upload } from '../core/middleware/upload.middleware';

const adminRouter: Router = express.Router();
const getAdminUser = () => new UserAdmin();
const getAdminProduct = () => new productAdmin();

adminRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    let userModel: UserAdmin | null = null;
    try {
      const { vc_username, vc_password } = req.body;

      if (!vc_username || !vc_password) {
        res.status(400).json({ error: "Email y password son requeridos" });
        return;
      }

      userModel = getAdminUser();
      const result = await userModel.loginSuperAdmin(vc_username, vc_password);

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

adminRouter.post(
  "/restore-password",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: "Email es requerido" });
        return;
      }
      const userModel = getAdminUser();
      const result = await userModel.restorePassword(email);
      res.status(200).json({
        message: "Correo enviado correctamente",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error restaurando contraseña",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

adminRouter.post(
  "/reset-password",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          error: "Token y nueva contraseña son requeridos",
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          error: "La contraseña debe tener al menos 6 caracteres",
        });
        return;
      }

      const userModel = getAdminUser();
      const result = await userModel.resetPasswordWithToken(token, newPassword);

      res.status(200).json({
        message: result.message,
        success: true,
      });
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Errores específicos con códigos apropiados
      if (
        errorMessage.includes("Token inválido") ||
        errorMessage.includes("expirado")
      ) {
        res.status(401).json({
          error: errorMessage,
          success: false,
        });
        return;
      }

      res.status(500).json({
        error: "Error al restablecer contraseña",
        details: errorMessage,
        success: false,
      });
    }
  },
);

adminRouter.post("/create-user-in-client", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, lastname, email, id_client, id_user_creator } = req.body;
    const userAdmin = getAdminUser();
    const result = await userAdmin.createUserInClient(name, lastname, email, id_client, id_user_creator);
    res.status(201).json({
      message: "Usuario creado exitosamente",
      data: result,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error creando usuario",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

adminRouter.post("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_user, id_client, name, description, vc_image } = req.body;

    if (!id_user || !id_client || !name) {
      res.status(400).json({ error: "id_user, id_client y name son requeridos" });
      return;
    }

    const productModel = getAdminProduct();
    const result = await productModel.createProduct(id_user, id_client, name, {
      description,
      vc_image
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error creando producto",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

adminRouter.get("/products/client/:id_client", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_client } = req.params;

    if (!id_client) {
      res.status(400).json({ error: "id_client es requerido" });
      return;
    }

    const productModel = getAdminProduct();
    const products = await productModel.getProductsByClient(Number(id_client));

    res.status(200).json({
      message: "Productos obtenidos exitosamente",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo productos",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

adminRouter.get("/products/:id_product", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_product } = req.params;

    if (!id_product) {
      res.status(400).json({ error: "id_product es requerido" });
      return;
    }

    const productModel = getAdminProduct();
    const product = await productModel.getProductById(Number(id_product));

    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }

    res.status(200).json({
      message: "Producto obtenido exitosamente",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obteniendo producto",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

adminRouter.post(
  "/products/:id_product/image",
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id_product } = req.params;
      const { id_client } = req.body;

      if (!req.file) {
        res.status(400).json({ error: "No se envió ninguna imagen" });
        return;
      }

      const productModel = getAdminProduct();

      const imageUrl = await productModel.uploadProductImage(
        Number(id_client),
        Number(id_product),
        req.file.buffer
      );

      await productModel.updateProductImage(Number(id_product), imageUrl);

      res.status(200).json({
        message: "Imagen subida exitosamente",
        data: { url: imageUrl },
      });
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      res.status(500).json({
        error: "Error al subir imagen",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
);

adminRouter.put("/products/:id_product", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_product } = req.params;
    const { name, description } = req.body;

    if (!id_product) {
      res.status(400).json({ error: "id_product es requerido" });
      return;
    }

    const productModel = getAdminProduct();
    const result = await productModel.updateProduct(Number(id_product), {
      name,
      description,
    });

    res.status(200).json({
      message: result.message,
      success: result.success,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error actualizando producto",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Eliminar producto (soft delete)
adminRouter.delete("/products/:id_product", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_product } = req.params;

    if (!id_product) {
      res.status(400).json({ error: "id_product es requerido" });
      return;
    }

    const productModel = getAdminProduct();
    const result = await productModel.deleteProduct(Number(id_product));

    res.status(200).json({
      message: result.message,
      success: result.success,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error eliminando producto",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export default adminRouter;
