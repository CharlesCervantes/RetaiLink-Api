import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Productos {
    id_producto?: number;
    id_negocio: number;
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
        const { vc_nombre, vc_descripcion, vc_image_url, id_negocio } = producto;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO productos (id_negocio, vc_nombre, vc_descripcion, vc_image_url, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?, ?, ?)',
            [id_negocio, vc_nombre, vc_descripcion, vc_image_url, timestamp, timestamp]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
    }
}

export const get_all_productos = async (id_negocio: number): Promise<Productos[]> => {
    try {
      const [rows] = await pool.query<RowDataPacket[] & Productos[]>(
        `SELECT * FROM productos WHERE id_negocio = ? AND b_estatus = 1`,
        [id_negocio]
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  };
  
