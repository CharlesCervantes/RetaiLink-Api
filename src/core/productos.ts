import pool from '@/config/database';
import { ResultSetHeader } from 'mysql2';

export interface Productos {
    id_producto?: number;
    vc_nombre: string;
    vc_descripcion?: string;
    vc_image_url?: string;
}

export interface PreguntasProducto {
    id_pregunta_producto?: number;
    id_producto: number;
    vc_tipo: string;
    vc_pregunta: string;
    b_imagen_evidencia?: boolean;
}

export const create_producto = async (producto: Productos): Promise<number> => {
    try {
        const { vc_nombre, vc_descripcion, vc_image_url } = producto;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO productos (vc_nombre, vc_descripcion, vc_image_url) VALUES (?, ?, ?)',
            [vc_nombre, vc_descripcion, vc_image_url]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
}

export const create_pregunta_producto = async (preguntas: PreguntasProducto[], id_producto: number): Promise<number> => {
    try {
        if(!preguntas || preguntas.length === 0) throw new Error('No hay preguntas para insertar');

        const placeholders = preguntas.map(() => '(?, ?, ?, ?)').join(', ');
        const values = preguntas.flatMap(p => [
            id_producto,
            p.vc_tipo,
            p.vc_pregunta,
            p.b_imagen_evidencia || false
        ]);

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO preguntas_producto (id_producto, vc_tipo, vc_pregunta, b_imagen_evidencia) VALUES ${placeholders}`,
            values
        );

        return result.affectedRows;
    } catch (error) {
        console.error('Error al crear preguntas de producto:', error);
        throw error;
    }
}