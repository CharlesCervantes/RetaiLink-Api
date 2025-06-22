import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

export interface Pregunta {
    id_pregunta?: number;
    i_categoria: number;  // aqui comentaremos sera solo un switch para las categorias
    vc_pregunta: string;
    b_evidencia: boolean; // si es true se espera una evidencia, si es false no se espera evidencia
    dt_registro?: number; // fecha de registro
    dt_actualizacion?: number; // fecha de actualizacion
    b_estatus?: boolean; // si es true la pregunta esta activa, si es false la pregunta esta inactiva
}

export const create_pregunta = async (pregunta: Pregunta): Promise<number> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000); // Obtener el timestamp actual
        const { i_categoria, vc_pregunta, b_evidencia } = pregunta;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO preguntas (i_categoria, vc_pregunta, b_evidencia, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?, ?)',
            [i_categoria, vc_pregunta, b_evidencia, timestamp, timestamp]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear pregunta:', error);
        throw error;
    }
}

