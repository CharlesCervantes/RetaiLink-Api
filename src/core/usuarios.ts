import pool from '@/config/database';
import { ResultSetHeader } from 'mysql2';
import { hash_password } from '@/core/utils';


export interface User {
    id_usuario?: number;
    vc_username: string;
    vc_password: string;
}

// TODO: agregar validaciones para el usuario y la contraseña
export const create_user = async (user: User): Promise<number> => {
    try {
        const { vc_username, vc_password } = user;
        const hashedPassword = await hash_password(vc_password);
        
        // Usa placeholders (?) para los valores
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO usuarios (vc_username, vc_password) VALUES (?, ?)',
            [vc_username, hashedPassword]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario admin:', error);
        throw error;
    }
};