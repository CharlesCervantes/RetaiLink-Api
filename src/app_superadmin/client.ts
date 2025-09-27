import db from "../config/database";
import { Database } from "../core/database";
import { Utils } from "../core/utils";

export class Client {
    private db: Database = db;

    constructor(){}

    async createClient(id_user: number, name: string){
        let commit = false;
        try {
            if(!this.db.inTransaction){
                this.db.beginTransaction();
                commit = true;
            }
            const result = await this.db.execute(
                "INSERT INTO clients (id_user, name) VALUES (?, ?)",
                [id_user, name]
            );

            const clientId = result.insertId;

            await Utils.registerClienteLog(this.db, clientId, id_user, "Cliente creado");

            if(commit){
                await this.db.commit();
            }

            return {
                id: clientId,
                message: "Cliente creado exitosamente"
            };
        } catch (error) {
            console.error("Error en createClient: ", error);
            if (commit) {
                await this.db.rollback();
            }
            throw error;
        }
    }
}