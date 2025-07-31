import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';

export interface pedido_plantilla {
    id_pedido_plantilla?: number,
    id_negocio: number,
    id_usuario: number,
    vc_titulo: string,
    vc_descripcion: string,
    dt_fecha_creacion: number,
    dt_fecha_actualizacion: number
}

export const create_pedido_plantilla = async ( payload: pedido_plantilla, epoch: number, connection: PoolConnection ): Promise<{ error: boolean; data: { id_pedido_plantilla: number } | null; message: string; }> => {
    try {
        const { id_negocio, id_usuario, vc_descripcion, vc_titulo } = payload;

        const query = `
            INSERT INTO pedido_plantillas 
            (id_negocio, id_usuario, vc_titulo, vc_descripcion, dt_fecha_creacion, dt_fecha_actualizacion) 
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const params = [
            id_negocio,
            id_usuario,
            vc_titulo,
            vc_descripcion,
            epoch,
            epoch,
        ];

        const [result] = await connection.execute(query, params);
        const insertId = (result as ResultSetHeader).insertId;

        return {
            error: false,
            data: { id_pedido_plantilla: insertId },
            message: 'Plantilla de pedido creada correctamente',
        };
    } catch (error: any) {
        console.error('Error al crear plantilla de pedido:', error);
        return {
            error: true,
            data: null,
            message: 'Error al crear plantilla de pedido',
        };
    }
};

export const get_pedido_plantilla_list = async (id_negocio: number, connection?: PoolConnection) => {
    try {
        const query = `
            SELECT 
            id_pedido_plantilla, id_negocio, id_usuario, vc_titulo, vc_descripcion, dt_fecha_creacion, dt_fecha_actualizacion 
            FROM pedido_plantilla 
            WHERE id_negocio = ?;
        `
        const params = [id_negocio];

        const [rows] = connection
            ? await connection.query<RowDataPacket[]>(query, params)
            : await pool.query<RowDataPacket[]>(query, params);
        
        const result = rows.length > 0 ? (rows as pedido_plantilla[]) : [];
        
        return {
            error: false,
            data: result,
            message: "Lista obtenida con exito"
        } 
    } catch (error) {
        console.error("Error al obtener una lista de plantillas de pedido filtrada por negocio: ", error);
        return {
            error: true,
            data: null,
            message: "Error al obtener la lista de plantillas"
        }
    }
}

export const get_pedido_plantilla = async (id_pedido_plantilla: number, connection?: PoolConnection) => {
    try {
        const query = `
            SELECT 
            id_pedido_plantilla, id_negocio, id_usuario, vc_titulo, vc_descripcion, dt_fecha_creacion, dt_fecha_actualizacion 
            FROM pedido_plantilla 
            WHERE id_pedido_plantilla = ?;
        `
        const params = [id_pedido_plantilla];

        const [rows] = connection
            ? await connection.query<RowDataPacket[]>(query, params)
            : await pool.query<RowDataPacket[]>(query, params);
        
        const result = rows.length > 0 ? (rows[0] as pedido_plantilla) : null;
        
        return {
            error: false,
            data: result,
            message: "Plantilla obtenida con exito"
        } 
    } catch (error) {
        console.error("Error al obtener una plantilla de pedido por ID: ", error);
        return {
            error: true,
            data: null,
            message: "Error al obtener la plantilla"
        }
    }
}

export const update_pedido_plantilla = async (payload: pedido_plantilla, epoch: number, connection: PoolConnection): Promise<{ error: boolean; data: null; message: string; }> => {
    try {
        const { id_pedido_plantilla, id_negocio, id_usuario, vc_titulo, vc_descripcion } = payload;

        const query = `
            UPDATE pedido_plantilla 
            SET 
                id_negocio = ?, 
                id_usuario = ?, 
                vc_titulo = ?, 
                vc_descripcion = ?, 
                dt_fecha_actualizacion = ? 
            WHERE id_pedido_plantilla = ?;
        `;

        const params = [
            id_negocio,
            id_usuario,
            vc_titulo,
            vc_descripcion,
            epoch,
            id_pedido_plantilla
        ];

        await connection.execute(query, params);

        return {
            error: false,
            data: null,
            message: 'Plantilla de pedido actualizada correctamente',
        };
    } catch (error: any) {
        console.error('Error al actualizar plantilla de pedido:', error);
        return {
            error: true,
            data: null,
            message: 'Error al actualizar plantilla de pedido',
        };
    }
};

export const delete_pedido_plantilla = async (id_pedido_plantilla: number, epoch: number, connection: PoolConnection): Promise<{ error: boolean; data: null; message: string; }> => {
    try {
        const query = `
            UPDATE pedido_plantilla 
            SET 
                b_status = 0,
                dt_fecha_actualizacion = ? 
            WHERE id_pedido_plantilla = ?;
        `;

        const params = [
            epoch,
            id_pedido_plantilla
        ];

        await connection.execute(query, params);

        return {
            error: false,
            data: null,
            message: 'Plantilla de pedido actualizada correctamente',
        };
    } catch (error: any) {
        console.error('Error al actualizar plantilla de pedido:', error);
        return {
            error: true,
            data: null,
            message: 'Error al actualizar plantilla de pedido',
        };
    }
};
