import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PoolConnection } from 'mysql2/promise';
import { Negocio } from '../core/interfaces';


export const create_negocio = async (negocio: Negocio, connection: PoolConnection): Promise<number> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        const { vc_nombre } = negocio;

        const [queryResult] = await connection.query(
            'INSERT INTO negocios (vc_nombre, dt_registro, dt_actualizacion) VALUES (?, ?, ?);',
            [vc_nombre, epochTime, epochTime]
        );
        const result = queryResult as ResultSetHeader;

        return result.insertId;
    } catch (error) {
        console.error('Error al crear negocio:', error);
        throw error;
    }
};

export const get_negocio = async (id_negocio: number, connection?: PoolConnection): Promise<Negocio | null> => {
    try {
        const query = 'SELECT id_negocio, vc_nombre, dt_registro, dt_actualizacion FROM negocios WHERE id_negocio = ? AND b_estatus = 1 LIMIT 1;';
        const params = [id_negocio];

        const [rows] = connection
            ? await connection.query<RowDataPacket[]>(query, params)
            : await pool.query<RowDataPacket[]>(query, params);

        return rows.length > 0 ? (rows[0] as Negocio) : null;
    } catch (error) {
        console.error('Error al obtener negocio:', error);
        throw error;
    }
};

export const get_all_negocios = async (): Promise<Negocio[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_negocio, vc_nombre, dt_registro, dt_actualizacion FROM negocios WHERE b_estatus = 1;'
        );
        
        return rows.length > 0 ? (rows as Negocio[]) : [];
    } catch (error) {
        console.error('Error al obtener todos los negocios:', error);
        throw error;
    }
};

export const get_negocio_by_nombre = async (nombre: string): Promise<Negocio | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_negocio, vc_nombre, dt_registro, dt_actualizacion FROM negocios WHERE vc_nombre = ? AND b_estatus = 1 LIMIT 1;',
            [nombre]
        );
        
        return rows.length > 0 ? (rows[0] as Negocio) : null;
    } catch (error) {
        console.error('Error al obtener negocio por nombre:', error);
        throw error;
    }
};

export const update_negocio = async (id_negocio: number, negocio: Negocio, connection: PoolConnection): Promise<boolean> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);        
        const { vc_nombre } = negocio;
        
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE negocios SET vc_nombre = ?, dt_actualizacion = ? WHERE id_negocio = ?;',
            [vc_nombre, epochTime, id_negocio]
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar negocio:', error);
        throw error;
    }
};

export const delete_negocio = async (id_negocio: number): Promise<boolean> => {
    try {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE negocios SET b_estatus = 0 WHERE id_negocio = ?;',
            [id_negocio]
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar negocio:', error);
        throw error;
    }
};

