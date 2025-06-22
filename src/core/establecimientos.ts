import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Establecimiento } from '../core/interfaces';

// CREATE - Crear un nuevo establecimiento
export const create_establecimiento = async (establecimiento: Establecimiento): Promise<number> => {
    try {
        const { vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca } = establecimiento;
        const timestamp = Math.floor(Date.now() / 1000);
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO establecimientos (vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, timestamp, timestamp]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear establecimiento:', error);
        throw error;
    }
}

// READ - Obtener un establecimiento por ID
export const get_establecimiento = async (id_establecimiento: number): Promise<Establecimiento | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_establecimiento, vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, b_estatus, dt_registro, dt_actualizacion FROM establecimientos WHERE id_establecimiento = ? AND b_estatus = 1 LIMIT 1;',
            [id_establecimiento]
        );
        
        return rows.length > 0 ? (rows[0] as Establecimiento) : null;
    } catch (error) {
        console.error('Error al obtener establecimiento:', error);
        throw error;
    }
}

// READ ALL - Obtener todos los establecimientos activos
export const get_all_establecimientos = async (): Promise<Establecimiento[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_establecimiento, vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, b_estatus, dt_registro, dt_actualizacion FROM establecimientos WHERE b_estatus = 1;'
        );
        
        return rows as Establecimiento[];
    } catch (error) {
        console.error('Error al obtener todos los establecimientos:', error);
        throw error;
    }
}

// UPDATE - Actualizar un establecimiento
export const update_establecimiento = async (id_establecimiento: number, establecimiento: Partial<Establecimiento>): Promise<boolean> => {
    try {
        const { vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, b_estatus } = establecimiento;
        const timestamp = Math.floor(Date.now() / 1000);
        
        // Construir dinámicamente la consulta SQL según los campos proporcionados
        let sql = 'UPDATE establecimientos SET dt_actualizacion = ?';
        const params: any[] = [timestamp];
        
        if (vc_nombre !== undefined) {
            sql += ', vc_nombre = ?';
            params.push(vc_nombre);
        }
        
        if (vc_direccion !== undefined) {
            sql += ', vc_direccion = ?';
            params.push(vc_direccion);
        }
        
        if (vc_num_economico !== undefined) {
            sql += ', vc_num_economico = ?';
            params.push(vc_num_economico);
        }
        
        if (vc_telefono !== undefined) {
            sql += ', vc_telefono = ?';
            params.push(vc_telefono);
        }
        
        if (vc_marca !== undefined) {
            sql += ', vc_marca = ?';
            params.push(vc_marca);
        }
        
        if (b_estatus !== undefined) {
            sql += ', b_estatus = ?';
            params.push(b_estatus);
        }
        
        sql += ' WHERE id_establecimiento = ?;';
        params.push(id_establecimiento);
        
        const [result] = await pool.query<ResultSetHeader>(sql, params);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al actualizar establecimiento:', error);
        throw error;
    }
}

// DELETE - Eliminación lógica (cambiar estatus a 0)
export const delete_establecimiento = async (id_establecimiento: number): Promise<boolean> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE establecimientos SET b_estatus = 0, dt_actualizacion = ? WHERE id_establecimiento = ?;',
            [timestamp, id_establecimiento]
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar establecimiento:', error);
        throw error;
    }
}

// DELETE - Eliminación física (borrar de la base de datos)
export const hard_delete_establecimiento = async (id_establecimiento: number): Promise<boolean> => {
    try {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM establecimientos WHERE id_establecimiento = ?;',
            [id_establecimiento]
        );
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar permanentemente establecimiento:', error);
        throw error;
    }
}

// SEARCH - Buscar establecimientos por nombre o dirección
export const search_establecimientos = async (searchTerm: string): Promise<Establecimiento[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_establecimiento, vc_nombre, vc_direccion, vc_num_economico, vc_telefono, vc_marca, b_estatus, dt_registro, dt_actualizacion FROM establecimientos WHERE (vc_nombre LIKE ? OR vc_direccion LIKE ?) AND b_estatus = 1;',
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        
        return rows as Establecimiento[];
    } catch (error) {
        console.error('Error al buscar establecimientos:', error);
        throw error;
    }
}

export const conectar_establecimineto_negocio = async (id_establecimiento: number, id_negocio: number, connection:any ): Promise<number> => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const [result] = await connection.promise().query(
            'INSERT INTO establecimiento_negocio (id_establecimiento, id_negocio, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?);',
            [id_establecimiento, id_negocio, timestamp, timestamp]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al conectar establecimiento y negocio:', error);
        throw error;
    }
} 

export const desconectar_establecimiento_negocio = async (id_establecimiento: number, id_negocio: number, connection:any ): Promise<boolean> => {
    try {
        const [result] = await connection.promise().query(
            'DELETE FROM establecimiento_negocio WHERE id_establecimiento = ? AND id_negocio = ?;',
            [id_establecimiento, id_negocio]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al desconectar establecimiento y negocio:', error);
        throw error;
    }
}