import { Store } from '../app_superadmin/store';
import { Utils } from '../core/utils';

export interface CreateStorepayload {
    id_store?:number,
    id_store_client?:number,
    id_client: number;
    id_user_creator: number; 
    name: string;
    store_code: string;
    street: string;
    ext_number: string;
    int_number: string;
    neighborhood: string;
    municipality: string;
    state: string;
    postal_code: string;
    country: string;
    latitude: number,
    longitude: number,
}

export class storesAdmin extends Store {
    async createStoreAdmin(payload: CreateStorepayload){
        try {
            const createStore = await this.createStore(payload.id_user_creator, {
                ...payload,
                id_store: 0,
                id_user: payload.id_user_creator,
                i_status: true,
                dt_register: '',
                dt_updated: ''
            });

            const assignStore = await this.assignStoreToClient(createStore.id, payload.id_client, payload.id_user_creator);

            return assignStore
        } catch (error) {
            return error;
        }
    }

    async getStoreByIdClient(id_store_client: number){
        try {
            const store_query = `SELECT sc.id_store_client, s.id_store, sc.id_client, sc.i_status, sc.dt_created, sc.dt_updated, s.name, s.store_code, s.street, s.ext_number, s.int_number,
                                 s.neighborhood, s.municipality, s.state, s.postal_code, s.country, s.latitude, s.longitude FROM stores_clients sc INNER JOIN stores s ON s.id_store = sc.id_store
                                 WHERE sc.id_store_client = ? AND sc.i_status = 1
                                `;
            const result = await this.db.select(store_query, [id_store_client]);

            if (!result || result.length === 0) {
                return { 
                    ok: false,
                    data: null,
                    message: "Establecimiento no encontrado" 
                };
            }

            return {
                ok: true,
                data: result[0],
                message: "Tienda cargada correctamente"
            }
        } catch (error) {
            console.log("f.getStoreByIdClient: ", error);
            throw error;
        }
    }

    async getStoresForClient(id_client: number) {
        try {
            const query = `
                SELECT 
                    sc.id_store_client,
                    sc.id_store,
                    sc.id_client,
                    sc.id_user_creator,
                    sc.i_status,
                    sc.dt_created,
                    sc.dt_updated,
                    s.name,
                    s.store_code,
                    s.street,
                    s.ext_number,
                    s.int_number,
                    s.neighborhood,
                    s.municipality,
                    s.state,
                    s.postal_code,
                    s.country,
                    s.latitude,
                    s.longitude
                FROM stores_clients sc
                INNER JOIN stores s ON sc.id_store = s.id_store
                WHERE sc.id_client = ? AND sc.i_status = 1 AND s.i_status = 1
                ORDER BY s.name ASC
            `;
            return await this.db.select(query, [id_client]);
        } catch (error) {
            console.error("Error en getStoresForClient: ", error);
            throw error;
        }
    }

    async updateStoreForClient(data_store_updated: CreateStorepayload) {
        try {

            console.log("data_store_updated.id_store_client: ", data_store_updated.id_store_client)

            // 1. Obtener datos actuales con un solo query
            const query_current = `
                SELECT 
                    sc.id_store_client,
                    sc.id_store,
                    s.name,
                    s.store_code,
                    s.street,
                    s.ext_number,
                    s.int_number,
                    s.neighborhood,
                    s.municipality,
                    s.state,
                    s.postal_code,
                    s.country,
                    s.latitude,
                    s.longitude
                FROM stores_clients sc
                INNER JOIN stores s ON s.id_store = sc.id_store
                WHERE sc.id_store_client = ? AND sc.i_status = 1
            `;
            
            const result = await this.db.select(query_current, [data_store_updated.id_store_client]);
            
            if (!result || result.length === 0) {
                return { success: false, message: "Establecimiento no encontrado" };
            }

            const store_stored = result[0];
            const id_store = store_stored.id_store;

            // 2. Comparar y construir campos a actualizar
            const comparableFields = [
                "name", "store_code", "street", "ext_number", "int_number",
                "neighborhood", "municipality", "state", "postal_code",
                "country", "latitude", "longitude"
            ] as const;

            const fieldsToUpdate: string[] = [];
            const values: any[] = [];

            for (const field of comparableFields) {
                const newValue = data_store_updated[field];
                const oldValue = store_stored[field];

                // Comparar como strings para evitar problemas de tipos
                const newStr = newValue !== undefined && newValue !== null ? String(newValue) : null;
                const oldStr = oldValue !== undefined && oldValue !== null ? String(oldValue) : null;

                if (newStr !== null && newStr !== oldStr) {
                    fieldsToUpdate.push(`${field} = ?`);
                    values.push(newValue);
                }
            }

            // 3. Si no hay cambios, retornar
            if (fieldsToUpdate.length === 0) {
                return { success: true, message: "No hay cambios que actualizar" };
            }

            // 4. Ejecutar UPDATE
            values.push(id_store);
            const query_update = `UPDATE stores SET ${fieldsToUpdate.join(", ")} WHERE id_store = ?`;

            console.log("query: ", query_update);
            console.log("values update: ", values);
            
            await this.db.execute(query_update, values);

            // 5. Registrar log (opcional)
            await Utils.registerStoreLog(this.db, id_store, data_store_updated.id_user_creator, "Tienda actualizada");

            return { success: true, message: "Establecimiento actualizado exitosamente" };

        } catch (error) {
            console.error("f.updateStoreForClient: ", error);
            throw error;
        }
    }

    async deleteStoreForClient(id_store_client: number) {
        try{

            const store = await this.getStoreByIdClient(id_store_client);

            if(!store.ok){
                return {
                    ok: false,
                    data: null,
                    message: "Tienda no encontrada"
                }
            }

            const remove_store = await this.removeStoreFromClient(store?.data?.id_store, store?.data?.id_client);

            if(!remove_store.ok){
                return {
                    ok: false,
                    data: null,
                    message: "Tienda no se ha podido eliminar."
                }
            }

            return {
                ok: true,
                data: null,
                message: "Tienda eliminada correctamente."
            }
        } catch(error){
            console.log("f.deleteStoreForClient: ", error);
        }
    }
}

