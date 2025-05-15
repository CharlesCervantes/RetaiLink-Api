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

interface usuarios_negocios {
    id_usuario_negocio?: number;
    id_usuario: number;
    id_negocio: number;
    dt_registro?: number;
    dt_actualizacion?: number;
    b_estatus?: boolean;
}

import { PoolConnection } from 'mysql2/promise';

export const create_user = async (user: User, connection: PoolConnection): Promise<number> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        const { vc_username, vc_password } = user;
        const hashedPassword = await hash_password(vc_password);

        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO usuarios (vc_username, vc_password, dt_registro, dt_actualizacion) VALUES (?, ?, ?, ?);',
            [vc_username, hashedPassword, epochTime, epochTime]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario:', error);
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

export const get_user_by_username = async (username: string): Promise<User | null> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, vc_password, dt_registro, dt_actualizacion FROM usuarios WHERE vc_username = ? AND b_estatus = 1 LIMIT 1;',
            [username]
        );
        
        return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
        console.error('Error al obtener usuario por nombre de usuario:', error);
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

export const create_usuario_negocio = async (usuario_negocio: usuarios_negocios, connection: PoolConnection): Promise<void> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        const { id_usuario, id_negocio } = usuario_negocio;

        await connection.query<ResultSetHeader>(
            'INSERT INTO usuarios_negocios (id_usuario, id_negocio, dt_registro, dt_actualizacion, b_estatus) VALUES (?, ?, ?, ?, 1);',
            [id_usuario, id_negocio, epochTime, epochTime]
        );
    } catch (error) {
        console.error('Error al crear relación usuario-negocio:', error);
        throw error;
    }
};



