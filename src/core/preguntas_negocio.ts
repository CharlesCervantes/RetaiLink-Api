import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PreguntaNegocio } from './interfaces';

export const create_pregunta_negocio = async (data: PreguntaNegocio): Promise<number> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const { id_pregunta, id_negocio, dc_precio } = data;

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO preguntas_negocio 
            (id_pregunta, id_negocio, dc_precio, b_activo, dt_registro, dt_actualizacion)
            VALUES (?, ?, ?, TRUE, ?, ?)`,
            [id_pregunta, id_negocio, dc_precio.toFixed(5), timestamp, timestamp]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al crear pregunta_negocio:', error);
        throw error;
    }
};

export const get_preguntas_by_negocio = async (id_negocio: number): Promise<PreguntaNegocio[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM preguntas_negocio
                WHERE id_negocio = ? AND b_activo = TRUE`,
            [id_negocio]
        );

        return rows as PreguntaNegocio[];
    } catch (error) {
        console.error('Error al obtener preguntas del negocio:', error);
        throw error;
    }
};

export const update_pregunta_negocio = async (
    id_pregunta_negocio: number,
    data: Partial<PreguntaNegocio>
): Promise<boolean> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const { dc_precio, id_pregunta, id_negocio, b_activo } = data;

        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE preguntas_negocio 
                SET 
                ${id_pregunta !== undefined ? 'id_pregunta = ?, ' : ''}
                ${id_negocio !== undefined ? 'id_negocio = ?, ' : ''}
                ${dc_precio !== undefined ? 'dc_precio = ?, ' : ''}
                ${b_activo !== undefined ? 'b_activo = ?, ' : ''}
                dt_actualizacion = ?
                WHERE id_pregunta_negocio = ?`,
            [
                ...(id_pregunta !== undefined ? [id_pregunta] : []),
                ...(id_negocio !== undefined ? [id_negocio] : []),
                ...(dc_precio !== undefined ? [dc_precio.toFixed(5)] : []),
                ...(b_activo !== undefined ? [b_activo] : []),
                timestamp,
                id_pregunta_negocio
            ]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar pregunta_negocio:', error);
        throw error;
    }
};

export const delete_pregunta_negocio = async (id_pregunta_negocio: number): Promise<boolean> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE preguntas_negocio 
                SET b_activo = FALSE, dt_actualizacion = ? 
                WHERE id_pregunta_negocio = ?`,
            [timestamp, id_pregunta_negocio]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar pregunta_negocio:', error);
        throw error;
    }
};

