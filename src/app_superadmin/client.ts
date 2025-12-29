import db from "../config/database";
import { Database } from "../core/database";
import { Utils } from "../core/utils";

interface CreateClientData {
    rfc?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    adiccional_notes?: string;
}

export class Client {
    private db: Database = db;

    constructor(){}

    async createClient(id_user: number, name: string, data: CreateClientData = {}) {
        let commit = false;
        try {
            if(!this.db.inTransaction){
                this.db.beginTransaction();
                commit = true;
            }

            const fields = ['id_user', 'name'];
            const values: any[] = [id_user, name];
            const placeholders = ['?', '?'];

            const optionalFields: (keyof CreateClientData)[] = [
                'rfc', 'email', 'phone', 'address', 'city', 'adiccional_notes'
            ];

            for (const field of optionalFields) {
                if (data[field] !== undefined && data[field] !== '') {
                    fields.push(field);
                    values.push(data[field]);
                    placeholders.push('?');
                }
            }

            const query = `INSERT INTO clients (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
            const result = await this.db.execute(query, values);

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

    async getClients() {
        try {
            const query = `SELECT id_client, name, i_status, dt_register, dt_updated, rfc, email, phone FROM clients`;
            const clients = await this.db.select(query);
            return clients;
        } catch (error) {
            console.error("Error en getClients: ", error);
            throw error;
        }
    }
}