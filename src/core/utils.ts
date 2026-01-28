import dotenv from "dotenv";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2/promise";
import { EmailService } from "./services/email/EmailService";

import { Database } from "./database";
import db from "../config/database";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_super_segura";

export interface TokenPayload {
  id: number;
  email: string;
}

export function generarCodigoAfiliacion(): string {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

interface GeocodingResult {
  latitude: number | null;
  longitude: number | null;
  formatted_address?: string;
}

interface ClientRow extends RowDataPacket {
  vc_initialism: string;
}

interface FolioRow extends RowDataPacket {
  id_folio: number;
  i_folio?: number;
}

export class Utils {
  static db: Database = db;

  static async registerUserLog(
    db: Database,
    userId: number,
    log: string,
  ): Promise<void> {
    let commit = false;
    try {
      if (!db.inTransaction) {
        await db.beginTransaction();
        commit = true;
      }
      await db.query(
        "INSERT INTO user_logs (id_user, `log`, i_status) VALUES (?, ?, 1)",
        [userId, log],
      );
      if (commit) {
        await db.commit();
      }
    } catch (error) {
      if (commit) {
        await db.rollback();
      }
      throw error;
    }
  }

  static async registerClienteLog(
    db: Database,
    clientId: number,
    userId: number,
    log: string,
  ): Promise<void> {
    let commit = false;
    try {
      if (!db.inTransaction) {
        await db.beginTransaction();
        commit = true;
      }

      const query =
        "INSERT INTO client_logs (id_client, id_user, `log`, i_status) VALUES (?, ?, ?, 1)";
      const params = [clientId, userId, log];
      await db.execute(query, params);

      if (commit) {
        await db.commit();
      }
    } catch (error) {
      if (commit) {
        await db.rollback();
      }
      throw error;
    }
  }

  static async registerStoreLog(
    db: Database,
    storeId: number,
    userId: number,
    log: string,
  ): Promise<void> {
    let commit = false;
    try {
      if (!db.inTransaction) {
        await db.beginTransaction();
        commit = true;
      }
      await db.query(
        "INSERT INTO store_logs (id_store, id_user, `log`, i_status) VALUES (?, ?, ?, 1)",
        [storeId, userId, log],
      );
      if (commit) {
        await db.commit();
      }
    } catch (error) {
      if (commit) {
        await db.rollback();
      }
      throw error;
    }
  }

  static async registerQuestionLog(
    db: Database,
    questionId: number,
    userId: number,
    log: string,
  ): Promise<void> {
    let commit = false;
    try {
      if (!db.inTransaction) {
        await db.beginTransaction();
        commit = true;
      }
      await db.query(
        "INSERT INTO question_logs (id_question, id_user, `log`, i_status) VALUES (?, ?, ?, 1)",
        [questionId, userId, log],
      );
      if (commit) {
        await db.commit();
      }
    } catch (error) {
      if (commit) {
        await db.rollback();
      }
      throw error;
    }
  }

  static async registerQuestionClientLog(
    db: Database,
    questionClientId: number,
    userId: number,
    log: string,
  ): Promise<void> {
    let commit = false;
    try {
      if (!db.inTransaction) {
        await db.beginTransaction();
        commit = true;
      }
      await db.query(
        "INSERT INTO question_client_logs (id_question_client, id_user, `log`, i_status) VALUES (?, ?, ?, 1)",
        [questionClientId, userId, log],
      );
      if (commit) {
        await db.commit();
      }
    } catch (error) {
      if (commit) {
        await db.rollback();
      }
      throw error;
    }
  }

  static async registerProductLog(
    db: Database,
    productId: number,
    userId: number,
    log: string,
  ): Promise<void> {
    let commit = false;
    try {
      if (!db.inTransaction) {
        await db.beginTransaction();
        commit = true;
      }
      await db.query(
        "INSERT INTO product_logs (id_product, id_user, `log`, i_status) VALUES (?, ?, ?, 1)",
        [productId, userId, log],
      );
      if (commit) {
        await db.commit();
      }
    } catch (error) {
      if (commit) {
        await db.rollback();
      }
      throw error;
    }
  }

  static async hash_password(password_unsecured: string): Promise<string> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password_unsecured, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error("Error al hashear la contraseña:", error);
      throw error;
    }
  }

  static async compare_password(
    password_unsecured: string,
    password_hashed: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password_unsecured, password_hashed);
      return isMatch;
    } catch (error) {
      console.error("Error al comparar contraseñas:", error);
      throw error;
    }
  }

  static generate_token(
    payload: TokenPayload,
    _expiresIn: string = "30d",
  ): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "30d",
    });
  }

  static verify_token(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as TokenPayload);
        }
      });
    });
  }

  /**
   * Envía un email usando el proveedor actual del EmailService
   * @param to - Destinatario(s) del email
   * @param subject - Asunto del email
   * @param html - Contenido HTML del email
   * @param text - Contenido en texto plano (opcional)
   * @returns Promise<boolean> - true si el email se envió correctamente
   */
  static async sendEmail(
    to: string | string[],
    subject: string,
    html: string,
    text?: string,
  ): Promise<boolean> {
    try {
      const emailService = new EmailService();

      const result = await emailService.send({
        to,
        subject,
        html,
        text,
      });

      if (!result.success) {
        console.error(`Error al enviar email: ${result.error}`);
        return false;
      }

      console.log(`Email enviado con ${result.provider}: ${result.messageId}`);
      return true;
    } catch (error) {
      console.error("Error al enviar email:", error);
      return false;
    }
  }

  static async geocodeAddress(address: string): Promise<GeocodingResult> {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const encodedAddress = encodeURIComponent(address);
      
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formatted_address: data.results[0].formatted_address
        };
      }

      console.log("Geocoding no encontró resultados para:", address);
      return { latitude: null, longitude: null };

    } catch (error) {
      console.error("Error en geocoding:", error);
      return { latitude: null, longitude: null };
    }
  }

  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  /**
 * Obtiene el siguiente folio disponible SIN crear registro
 * Solo consulta cuál sería el siguiente número
 */
static async getCurrentFolio(id_client: number, i_type: number = 1): Promise<string> {
  try {
    const getClient = "SELECT vc_initialism FROM clients WHERE id_client = ? LIMIT 1";
    const clientRows = await this.db.select<ClientRow[]>(getClient, [id_client]);
    
    if (!clientRows || clientRows.length === 0) {
      throw new Error(`Client ${id_client} not found`);
    }

    const initialism = clientRows[0].vc_initialism;

    // Obtener el ÚLTIMO folio registrado para este cliente/tipo
    const getLastFolio = `
      SELECT i_folio 
      FROM folios 
      WHERE id_client = ? AND i_type = ? 
      ORDER BY i_folio DESC 
      LIMIT 1
    `;
    const lastFolioRows = await this.db.select<FolioRow[]>(getLastFolio, [id_client, i_type]);

    let nextFolio: number;

    if (!lastFolioRows || lastFolioRows.length === 0) {
      // Si no existe ningún folio, el siguiente será 1
      nextFolio = 1;
    } else {
      // El siguiente es el último + 1
      nextFolio = lastFolioRows[0].i_folio! + 1;
    }

    const formattedFolio = `${initialism}${String(nextFolio).padStart(5, '0')}`;
    return formattedFolio;

  } catch (error) {
    console.error("Error getting current folio:", error);
    throw error;
  }
}

/**
 * Registra/inserta un nuevo folio usado en la base de datos
 * Cada ticket tendrá su propio registro en la tabla folios
 */
static async updateFolioCounter(id_client: number, i_type: number = 1): Promise<number> {
  try {
    // Obtener el último folio registrado
    const getLastFolio = `
      SELECT i_folio 
      FROM folios 
      WHERE id_client = ? AND i_type = ? 
      ORDER BY i_folio DESC 
      LIMIT 1
    `;
    const lastFolioRows = await this.db.select<FolioRow[]>(getLastFolio, [id_client, i_type]);

    let newFolioNumber: number;

    if (!lastFolioRows || lastFolioRows.length === 0) {
      newFolioNumber = 1;
    } else {
      newFolioNumber = lastFolioRows[0].i_folio! + 1;
    }

    // INSERTAR un NUEVO registro para este folio
    const insertFolio = `
      INSERT INTO folios (id_client, i_type, i_folio, i_before_folio, i_next_folio) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await this.db.execute(insertFolio, [
      id_client, 
      i_type, 
      newFolioNumber,
      newFolioNumber - 1,
      newFolioNumber + 1
    ]);

    return newFolioNumber;

  } catch (error) {
    console.error("Error inserting folio record:", error);
    throw error;
  }
}
}
