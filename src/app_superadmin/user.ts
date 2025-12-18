// models/User.ts
import { RowDataPacket } from "mysql2/promise";
import jwt from "jsonwebtoken";

import db from "../config/database";
import { TokenPayload, Utils } from "../core/utils";
import { IUser } from "../core/interfaces/user";
import {
  getPasswordChangedTemplate,
  getPasswordResetTemplate,
} from "../docs/emails/auth";

export class User {
  private db = db;
  constructor() {}

  // Controller functions
  async createSuperAdmin(
    email: string,
    password: string,
    name: string,
    lastname: string,
  ) {
    let commit = false;
    try {
      if (!this.db.inTransaction) {
        await this.db.beginTransaction();
        commit = true;
      }
      const hased_password = await Utils.hash_password(password);
      const [result]: any = await this.db.query(
        "INSERT INTO users (email, password, i_rol, name, lastname) VALUES (?, ?, 1, ?, ?)",
        [email, hased_password, name, lastname],
      );
      await Utils.registerUserLog(
        this.db,
        result.insertId,
        "Super admin creado",
      );
      if (commit) {
        await this.db.commit();
      }
      const insert = await this.getUserById(result.insertId);
      return insert;
    } catch (error) {
      if (commit) {
        await this.db.rollback();
      }
      throw error;
    }
  }

  async loginSuperAdmin(email: string, password: string) {
    try {
      const user = await this.getUserByEmail(email);
      const isValidPasswprd = Utils.compare_password(password, user.password);
      if (!isValidPasswprd) {
        throw new Error("Contraseña incorrecta");
      }
      const tokenPayload: TokenPayload = {
        id: user.id_user!,
        email: user.email,
      };
      const token = Utils.generate_token(tokenPayload);
      const resp = {
        user,
        token,
      };
      return resp;
    } catch (error) {}
  }

  async restorePassword(email: string) {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const token = Utils.generate_token({
        id: user.id_user!,
        email: user.email,
      });
      const expiresAt = new Date(Date.now() + 3600000);
      await this.updateResetToken(user.id_user!, token, expiresAt);

      // Crear link de recuperación
      const resetLink = `${process.env.FRONTEND_URL}/restore-pwd?token=${token}`;

      const emailSent = await Utils.sendEmail(
        user.email,
        "Recuperación de Contraseña",
        getPasswordResetTemplate(user.name, resetLink, token),
      );

      console.log(emailSent);

      if (!emailSent) {
        throw new Error("Error al enviar el correo de recuperación");
      }

      return {
        message: "Correo de recuperación enviado exitosamente",
      };
    } catch (error) {
      throw error;
    }
  }

  // Auxiliar functions
  async getUserById(id: number): Promise<IUser> {
    try {
      const [result]: any[] = await this.db.query(
        "SELECT id_user, email, i_rol, dt_register, dt_updated, name, lastname FROM users WHERE id_user = ? LIMIT 1",
        [id],
      );
      const user_finded = result[0];
      if (!user_finded) {
        throw new Error("Usuario no encontrado");
      }
      return user_finded;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser> {
    try {
      const [result]: any[] = await this.db.query(
        "SELECT id_user, email, password, i_rol, dt_register, dt_updated, name,lastname FROM users WHERE email = ? LIMIT 1",
        [email],
      );
      const user_finded = result[0];
      if (!user_finded) {
        throw new Error("Usuario no encontrado");
      }
      return user_finded;
    } catch (error) {
      throw error;
    }
  }

  // Método para actualizar el token de reset en la BD
  async updateResetToken(userId: number, token: string, expiresAt: Date) {
    try {
      const query = `UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id_user = ?`;
      await this.db.query(query, [token, expiresAt, userId]);
    } catch (error) {
      throw error;
    }
  }

  // Método para verificar el token y cambiar la contraseña
  async resetPasswordWithToken(token: string, newPassword: string) {
    try {
      const user_data = await this.getUserByResetToken(token);

      if (!user_data) {
        throw new Error("Token inválido o expirado");
      }

      if (
        user_data.reset_password_token !== token ||
        new Date(user_data.reset_password_expires!) < new Date()
      ) {
        throw new Error("El token ha expirado");
      }

      const hashedPassword = await Utils.hash_password(newPassword);

      await this.updatePassword(user_data.id_user, hashedPassword);

      const mailOptions = {
        from: `"Tu Empresa" <${process.env.GMAIL_USER}>`,
        to: user_data.email,
        subject: "Contraseña Actualizada",
        html: getPasswordChangedTemplate(user_data.name),
      };
      const transporter = Utils.generate_email_transporter();
      await transporter.sendMail(mailOptions);

      return {
        message: "Contraseña actualizada exitosamente",
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token inválido");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("El token ha expirado");
      }
      throw error;
    }
  }

  async getUserByResetToken(token: string): Promise<IUser | null> {
    try {
      const query = `
        SELECT * FROM users
        WHERE reset_password_token = ?
        AND reset_password_expires > NOW()
      `;
      const rows = await this.db.select<RowDataPacket[]>(query, [token]);
      return (rows[0] as IUser) || null;
    } catch (error) {
      throw new Error("Error al buscar usuario por token");
    }
  }

  async updatePassword(userId: number, hashedPassword: string) {
    const query = `
      UPDATE users
      SET password = ?,
          reset_password_token = NULL,
          reset_password_expires = NULL
      WHERE id_user = ?
    `;
    await this.db.query(query, [hashedPassword, userId]);
  }
}
