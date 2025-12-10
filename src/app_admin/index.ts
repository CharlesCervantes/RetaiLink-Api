import express, { Router, Request, Response } from "express";
import { UserAdmin } from "./userAdmin";

const adminRouter: Router = express.Router();
const getAdminUser = () => new UserAdmin();

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

export default adminRouter;
