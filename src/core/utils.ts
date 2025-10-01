import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Database } from './database'
// import { bucket } from "../config/cloud_store";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
export interface TokenPayload {
    id: number;
    email: string;
}

// Función para verificar token JWT
export const verify_token = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        console.error('Error al verificar token:', error);
        return null;
    }
};

export function generarCodigoAfiliacion(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

export class Utils {
    constructor(){}

    static async registerUserLog(db: Database, userId: number, log: string): Promise<void> {
        let commit = false;
        try {
            if (!db.inTransaction) {
                await db.beginTransaction();
                commit = true;
            }
            await db.query(
                "INSERT INTO user_logs (id_user, `log`, i_status) VALUES (?, ?, 1)",
                [userId, log]
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

    static async registerClienteLog(db: Database, clientId: number, userId: number, log: string): Promise<void> {
        let commit = false;
        try {
            if (!db.inTransaction) {
                await db.beginTransaction();
                commit = true;
            }

            const query = "INSERT INTO client_logs (id_client, id_user, `log`, i_status) VALUES (?, ?, ?, 1)";
            const params = [clientId, userId, log];
            const resp = await db.execute(query, params);

            console.log("resp: ", resp);

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

    static async registerStoreLog(db: Database, storeId: number, userId: number, log: string): Promise<void> {
        let commit = false;
        try {
            if (!db.inTransaction) {
                await db.beginTransaction();
                commit = true;
            }
            await db.query(
                "INSERT INTO store_logs (id_store, id_user, `log`, i_status) VALUES (?, ?, ?, 1)",
                [storeId, userId, log]
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

    static async registerQuestionLog(db: Database, questionId: number, userId: number, log: string): Promise<void> {
        let commit = false;
        try {
            if (!db.inTransaction) {
                await db.beginTransaction();
                commit = true;
            }
            await db.query(
                "INSERT INTO question_logs (id_question, id_user, `log`, i_status) VALUES (?, ?, ?, 1)",
                [questionId, userId, log]
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

    static async registerQuestionClientLog(db: Database, questionClientId: number, userId: number, log: string): Promise<void> {
        let commit = false;
        try {
            if (!db.inTransaction) {
                await db.beginTransaction();
                commit = true;
            }
            await db.query(
                "INSERT INTO question_client_logs (id_question_client, id_user, `log`, i_status) VALUES (?, ?, ?, 1)",
                [questionClientId, userId, log]
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

    static async hash_password (password_unsecured: string): Promise<string> {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password_unsecured, saltRounds);
            return hashedPassword;
        } catch (error) {
            console.error('Error al hashear la contraseña:', error);
            throw error;
        }
    }

    static async compare_password (password_unsecured: string, password_hashed: string): Promise<boolean> {
        try {
            const isMatch = await bcrypt.compare(password_unsecured, password_hashed);
            return isMatch;
        } catch (error) {
            console.error('Error al comparar contraseñas:', error);
            throw error;
        }
    }

    static generate_token (payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, { 
            expiresIn: '30d'
        });
    };
}