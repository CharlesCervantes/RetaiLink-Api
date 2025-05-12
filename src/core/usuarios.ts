import pool from '@/config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { hash_password } from '@/core/utils';


export interface User {
    id_usuario?: number;
    vc_username: string;
    vc_password: string;
    dt_registro?: number;
    dt_actualizacion?: number;
    b_estatus?: boolean;
}

export const create_user = async (user: User): Promise<number> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);        
        const { vc_username, vc_password } = user;
        const hashedPassword = await hash_password(vc_password);
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO usuarios (vc_username, vc_password, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?);',
            [vc_username, hashedPassword, epochTime, epochTime]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario admin:', error);
        throw error;
    }
};

export const get_user = async (id_usuario: number): Promise<User | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, vc_password, dt_registro, dt_actualizacion FROM usuarios WHERE id_usuario = ? AND b_estatus = 1 LIMIT 1;',
            [id_usuario]
        );
        
        return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
        console.error('Error al obtener usuario admin:', error);
        throw error;
    }
};

export const get_all_users = async (): Promise<User[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, vc_password, dt_registro, dt_actualizacion FROM usuarios WHERE b_estatus = 1;'
        );
        
        return rows.length > 0 ? (rows as User[]) : [];
    } catch (error) {
        console.error('Error al obtener todos los usuarios admin:', error);
        throw error;
    }
};

export const update_user = async (id_usuario: number, user: User): Promise<User | null> => {
    try {
        const { vc_username, vc_password } = user;
        const hashedPassword = await hash_password(vc_password);
        const epochTime = Math.floor(Date.now() / 1000);
        
        // Actualizar el usuario
        await pool.query<ResultSetHeader>(
            'UPDATE usuarios SET vc_username = ?, vc_password = ?, dt_actualizacion = ? WHERE id_usuario = ? AND b_estatus = 1;',
            [vc_username, hashedPassword, epochTime, id_usuario]
        );

        // Consultar el registro actualizado
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, dt_actualizacion, b_estatus FROM usuarios WHERE id_usuario = ?;',
            [id_usuario]
        );

        if (rows.length > 0) {
            return rows[0] as User;
        }

        return null; // Si no se encuentra el usuario
    } catch (error) {
        console.error('Error al actualizar usuario admin:', error);
        throw error;
    }
};

// TODO: revisar si elk true es corrwecto al envialo aqui
export const delete_user = async (id_usuario: number): Promise<boolean> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        
        await pool.query<ResultSetHeader>(
            'UPDATE usuarios SET b_estatus = 0, dt_actualizacion = ? WHERE id_usuario = ?;',
            [epochTime, id_usuario]
        );

        return true; // Usuario eliminado (marcado como inactivo)
    } catch (error) {
        console.error('Error al eliminar usuario admin:', error);
        throw error;
    }
};

export const hard_delete_user = async (id_usuario: number): Promise<void> => {
    try {
        await pool.query<ResultSetHeader>(
            'DELETE FROM usuarios WHERE id_usuario = ?;',
            [id_usuario]
        );
    } catch (error) {
        console.error('Error al eliminar usuario admin:', error);
        throw error;
    }
};



