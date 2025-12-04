import express, { Router, Request, Response } from "express";
import { UserAdmin } from "./userAdmin";

const adminRouter: Router = express.Router();
const getAdminUser = () => new UserAdmin();

adminRouter.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    let userModel: UserAdmin | null = null;
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email y password son requeridos" });
        return;
      }
      userModel = getAdminUser();
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

export default adminRouter;
