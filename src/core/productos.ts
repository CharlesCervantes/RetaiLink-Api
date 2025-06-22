import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

export interface Productos {
    id_producto?: number;
    vc_nombre: string;
    vc_descripcion?: string;
    vc_image_url?: string;
    dt_registro?: number;
    dt_actualizacion?: number;
    b_estatus?: boolean;
}


export const create_producto = async (producto: Productos): Promise<number> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000); 
        const { vc_nombre, vc_descripcion, vc_image_url } = producto;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO productos (vc_nombre, vc_descripcion, vc_image_url, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?, ?)',
            [vc_nombre, vc_descripcion, vc_image_url, timestamp, timestamp]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
}
