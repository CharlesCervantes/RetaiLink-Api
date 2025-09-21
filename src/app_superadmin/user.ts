// models/User.ts
import db from "../config/database";
import { Utils } from '../core/utils'

export class User {
    private db = db;

    constructor() {}

    async createSuperAdmin(email: string, password: string) {
        let commit = false;
        try {
        if (!this.db.inTransaction) {
            await this.db.beginTransaction();
            commit = true;
        }

        const [result]: any = await this.db.query(
            "INSERT INTO users (email, password, i_rol) VALUES (?, ?, 1)",
            [email, password]
        );

        await Utils.registerUserLog(this.db, result.insertId, "Super admin creado");

        if (commit) {
            await this.db.commit();
        }

        return result;
        } catch (error) {
        if (commit) {
            await this.db.rollback();
        }
        throw error;
        }
    }
}
