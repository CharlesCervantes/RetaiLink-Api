import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

export interface Pregunta {
    id_pregunta?: number;
    vc_pregunta: string;
    vc_tipo: string; // tipo de pregunta, puede ser 'text', 'number', 'date', etc.
    b_evidencia: boolean; // si es true se espera una evidencia, si es false no se espera evidencia
    b_requerido: boolean; // si es true la pregunta es requerida, si es false la pregunta no es requerida
    dt_registro?: number; // fecha de registro
    dt_actualizacion?: number; // fecha de actualizacion
    b_estatus?: boolean; // si es true la pregunta esta activa, si es false la pregunta esta inactiva
}

export const create_pregunta = async (pregunta: Pregunta): Promise<number> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000); // Obtener el timestamp actual
        const { vc_pregunta, vc_tipo, b_evidencia, b_requerido} = pregunta;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO preguntas (vc_pregunta, vc_tipo, b_photo, b_required, b_estatus, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?, TRUE, ?, ?);',
            [vc_pregunta, vc_tipo, b_evidencia, b_requerido, timestamp, timestamp]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear pregunta:', error);
        throw error;
    }
}

export const get_pregunta_by_id = async (id_pregunta: number): Promise<Pregunta | null> => {
    try {
        const [rows] = await pool.query<any[]>(
            'SELECT * FROM preguntas WHERE id_pregunta = ? LIMIT 1',
            [id_pregunta]
        );
        
        if (rows.length === 0) {
            return null; // No se encontró la pregunta
        }
        
        return rows[0]; // Retorna la primera pregunta encontrada
    }
    catch (error) {
        console.error('Error al obtener pregunta por ID:', error);
        throw error;
    }
}

export const get_all_preguntas = async (): Promise<Pregunta[]> => {
    try {
        const [rows] = await pool.query<any[]>(
            'SELECT * FROM preguntas WHERE b_estatus = TRUE'
        );
        
        return rows; // Retorna todas las preguntas activas
    } catch (error) {
        console.error('Error al obtener todas las preguntas:', error);
        throw error;
    }
}

export const update_pregunta = async (id_pregunta: number, pregunta: Pregunta): Promise<void> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000); // Obtener el timestamp actual
        const { vc_pregunta, vc_tipo, b_evidencia, b_requerido } = pregunta;
        
        await pool.query(
            'UPDATE preguntas SET vc_pregunta = ?, vc_tipo = ?, b_photo = ?, b_required = ?, dt_actualizacion = ? WHERE id_pregunta = ?',
            [vc_pregunta, vc_tipo, b_evidencia, b_requerido, timestamp, id_pregunta]
        );
    } catch (error) {
        console.error('Error al actualizar pregunta:', error);
        throw error;
    }
}

export const delete_pregunta = async (id_pregunta: number): Promise<void> => {
    try {
        await pool.query(
            'UPDATE preguntas SET b_estatus = FALSE WHERE id_pregunta = ?',
            [id_pregunta]
        );
    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        throw error;
    }
}

export const get_preguntas_by_tipo = async (vc_tipo: string): Promise<Pregunta[]> => {
    try {
        const [rows] = await pool.query<any[]>(
            'SELECT * FROM preguntas WHERE vc_tipo = ? AND b_estatus = TRUE',
            [vc_tipo]
        );
        
        return rows; // Retorna todas las preguntas del tipo especificado
    } catch (error) {
        console.error('Error al obtener preguntas por tipo:', error);
        throw error;
    }
}

export const get_preguntas_by_evidencia = async (b_evidencia: boolean): Promise<Pregunta[]> => {
    try {
        const [rows] = await pool.query<any[]>(
            'SELECT * FROM preguntas WHERE b_photo = ? AND b_estatus = TRUE',
            [b_evidencia]
        );
        
        return rows; // Retorna todas las preguntas que requieren o no requieren evidencia
    } catch (error) {
        console.error('Error al obtener preguntas por evidencia:', error);
        throw error;
    }
} 

