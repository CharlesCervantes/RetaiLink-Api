import { IStore } from '../core/interfaces/store';
import db from '../config/database';
import { Database } from '../core/database';
import { Utils } from '../core/utils';

export class Store {
    private db: Database = db;
    
    constructor(){}

    async createStore(id_user: number, storeData: IStore) {
        let commit = false;
        try {
            if (!this.db.inTransaction) {
                await this.db.beginTransaction();
                commit = true;
            }

            let query = "INSERT INTO stores(id_user, name";
            let queryValues = "VALUES (?, ?";
            let params: any[] = [id_user, storeData.name];

            if (storeData.store_code) {
                query += ", store_code";
                queryValues += ", ?";
                params.push(storeData.store_code);
            }
            if (storeData.street) {
                query += ", street";
                queryValues += ", ?";
                params.push(storeData.street);
            }
            if (storeData.ext_number) {
                query += ", ext_number";
                queryValues += ", ?";
                params.push(storeData.ext_number);
            }
            if (storeData.int_number) {
                query += ", int_number";
                queryValues += ", ?";
                params.push(storeData.int_number);
            }
            if (storeData.neighborhood) {
                query += ", neighborhood";
                queryValues += ", ?";
                params.push(storeData.neighborhood);
            }
            if (storeData.municipality) {
                query += ", municipality";
                queryValues += ", ?";
                params.push(storeData.municipality);
            }
            if (storeData.state) {
                query += ", state";
                queryValues += ", ?";
                params.push(storeData.state);
            }
            if (storeData.postal_code) {
                query += ", postal_code";
                queryValues += ", ?";
                params.push(storeData.postal_code);
            }
            if (storeData.country) {
                query += ", country";
                queryValues += ", ?";
                params.push(storeData.country);
            }
            if (storeData.latitude) {
                query += ", latitude";
                queryValues += ", ?";
                params.push(storeData.latitude);
            }
            if (storeData.longitude) {
                query += ", longitude";
                queryValues += ", ?";
                params.push(storeData.longitude);
            }
            query += ", i_status)";
            queryValues += ", 1)";

            const result = await this.db.execute(
                `${query} ${queryValues}`,
                params
            );

            await Utils.registerStoreLog(this.db, result.insertId, id_user, "Tienda creada");

            if (commit) {
                await this.db.commit();
            }

            return {
                id: result.insertId,
                message: "Tienda creada exitosamente"
            };
        } catch (error) {
            console.error("Error en createStore: ", error);
            if (commit) {
                await this.db.rollback();
            }
            throw error;
        }
    }
}

