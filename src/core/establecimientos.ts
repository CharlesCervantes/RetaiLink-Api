import pool from '@/config/database';
import { ResultSetHeader } from 'mysql2';

export interface Establecimineto {
    id_establecimineto?: number;
    vc_nombre: string;
    vc_direccion?: string;
    vc_num_economico?: string; // numero de serie o identificador del establecimiento
    vc_telefono?: string;
    vc_marca?: string; // marca del establecimiento
}

export const create_establecimiento = async (establecimiento: Establecimineto): Promise<number> => {
    try {
        const { vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca } = establecimiento;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO establecimientos (vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca) VALUES (?, ?, ?, ?, ?)',
            [vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear establecimiento:', error);
        throw error;
    }
}