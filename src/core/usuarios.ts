import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { hash_password } from '../core/utils';
import { User } from '../core/interfaces';
import { PoolConnection } from 'mysql2/promise';

export const create_user = async (user: User, connection: PoolConnection): Promise<number> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        const { vc_username, vc_password, vc_nombre, id_negocio, i_rol } = user;
        const hashedPassword = await hash_password(vc_password);

        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO usuarios (vc_username, vc_password, vc_nombre, dt_registro, dt_actualizacion, id_negocio, i_rol) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [vc_username, hashedPassword, vc_nombre, epochTime, epochTime, id_negocio, i_rol]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

export const get_user = async (
    id_usuario: number,
    connection?: PoolConnection
): Promise<User | null> => {
    try {
        const executor = connection || pool;
        const [rows] = await executor.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, vc_password, vc_nombre, dt_registro, dt_actualizacion, id_negocio FROM usuarios WHERE id_usuario = ? AND b_activo = 1 LIMIT 1;',
            [id_usuario]
        );

        return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;
    }
};

export const get_all_users = async (): Promise<User[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, vc_password, vc_nombre, dt_registro, dt_actualizacion, id_negocio FROM usuarios WHERE b_activo = 1;'
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
            'SELECT id_usuario, vc_username, vc_password, vc_nombre, dt_registro, dt_actualizacion, id_negocio, i_rol FROM usuarios WHERE vc_username = ? AND b_activo = 1 LIMIT 1;',
            [username]
        );
        
        return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
        console.error('Error al obtener usuario por nombre de usuario:', error);
        throw error;
    }
};

export const get_all_users_by_buisness = async (id_negocio: number): Promise<User[]> => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, vc_password, vc_nombre, dt_registro, dt_actualizacion, id_negocio, b_activo, dt_actualizacion, i_rol FROM usuarios WHERE id_negocio = ? AND b_activo = 1;',
            [id_negocio]
        );
        
        return rows.length > 0 ? (rows as User[]) : [];
    } catch (error) {
        console.error('Error al obtener usuarios por negocio:', error);
        throw error;
    }
};

export const update_user = async (
    id_usuario: number,
    user: User,
    connection: PoolConnection
): Promise<User | null> => {
    try {
        const { vc_username, vc_password, vc_nombre } = user;
        const hashedPassword = await hash_password(vc_password);
        const epochTime = Math.floor(Date.now() / 1000);

        // Actualizar el usuario
        await connection.query<ResultSetHeader>(
            'UPDATE usuarios SET vc_username = ?, vc_password = ?, vc_nombre = ?, dt_actualizacion = ? WHERE id_usuario = ? AND b_activo = 1;',
            [vc_username, hashedPassword, vc_nombre, epochTime, id_usuario]
        );

        // Consultar el usuario actualizado
        const [rows] = await connection.query<RowDataPacket[]>(
            'SELECT id_usuario, vc_username, vc_nombre, dt_actualizacion, b_activo, id_negocio FROM usuarios WHERE id_usuario = ?;',
            [id_usuario]
        );

        return rows.length > 0 ? (rows[0] as User) : null;
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

// TODO: revisar si elk true es corrwecto al envialo aqui
export const delete_user = async (id_usuario: number, connection: PoolConnection): Promise<boolean> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        
        await connection.query<ResultSetHeader>(
            'UPDATE usuarios SET b_activo = 0, dt_actualizacion = ? WHERE id_usuario = ?;',
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



