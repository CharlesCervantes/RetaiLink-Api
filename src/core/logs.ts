import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';


export interface logs_estableciminetos {
    id_log_establecimineto?: number;
    vc_log: string;
    id_establecimineto?: number;
    vc_nombre: string;
    vc_direccion?: string;
    vc_num_economico?: string;
    vc_telefono?: string;
    vc_marca?: string;
    b_estatus?: boolean;
    dt_registro: number; 
}

export const create_log_establecimiento = async (log: logs_estableciminetos): Promise<number> => {
    try {
        const { vc_log, id_establecimineto, vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, dt_registro } = log;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO logs_establecimientos (vc_log, id_establecimineto, vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, dt_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [vc_log, id_establecimineto, vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, dt_registro]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear log de establecimiento:', error);
        throw error;
    }
}