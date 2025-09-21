// models/User.ts
import db from "../config/database";
import { TokenPayload, Utils } from '../core/utils'
import { IUser } from "@/core/interfaces/user";

export class User {
    private db = db;
    constructor() {}

    // Controller functions
    async createSuperAdmin(email: string, password: string, name: string, lastname: string) {
        let commit = false;
        try {
            if (!this.db.inTransaction) {
                await this.db.beginTransaction();
                commit = true;
            }
            const hased_password = await Utils.hash_password(password);
            const [result]: any = await this.db.query(
                "INSERT INTO users (email, password, i_rol, name, lastname) VALUES (?, ?, 1, ?, ?)",
                [email, hased_password, name, lastname]
            );
            await Utils.registerUserLog(this.db, result.insertId, "Super admin creado");
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
            if(!isValidPasswprd){
                throw new Error("Contraseña incorrecta");
            }
            const tokenPayload: TokenPayload = {
                id: user.id_user!,
                email: user.email
            };
            const token = Utils.generate_token(tokenPayload);
            const resp = {
                user,
                token
            }
            return resp;
        } catch (error) {
            
        }
    }

    // Auxiliar functions
    async getUserById(id: number): Promise<IUser>{
        try {
            const [result]: any[] = await this.db.query("SELECT id_user, email, i_rol, dt_register, dt_updated, name, lastname FROM users WHERE id_user = ? LIMIT 1", [id]);
            const user_finded = result[0];
            if (!user_finded) {
                throw new Error("Usuario no encontrado");
            }
            return user_finded;
        } catch (error) {
            throw error;
        }
    }
    
    async getUserByEmail(email: string): Promise<IUser>{
        try {
            const [result]: any[] = await this.db.query("SELECT id_user, email, password, i_rol, dt_register, dt_updated, name,lastname FROM users WHERE email = ? LIMIT 1", [email]);
            const user_finded = result[0];
            if (!user_finded) {
                throw new Error("Usuario no encontrado");
            }
            return user_finded;
        } catch (error) {
            throw error;
        }
    }
}
