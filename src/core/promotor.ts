import pool from '@/config/database';
import { ResultSetHeader } from 'mysql2';
import { hash_password, compare_password } from '@/core/utils';


export interface Promotor {
    id_promotor?: number;
    vc_username: string;
    vc_password: string;
}

// TODO: agregar validaciones para el usuario y la contraseña
export const create_promotor = async (promotor: Promotor): Promise<number> => {
    try {
        const { vc_username, vc_password } = promotor;
        const hashedPassword = await hash_password(vc_password);
        
        // Usa placeholders (?) para los valores
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO promotores (vc_username, vc_password) VALUES (?, ?)',
            [vc_username, hashedPassword]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario admin:', error);
        throw error;
    }
};

export const verify_promotor = async (username: string, password: string): Promise<Promotor | null> => {
    try {
        const [rows] = await pool.query<any[]>(
            'SELECT id_promotor, vc_username, vc_password FROM promotores WHERE vc_username = ? LIMIT 1',
            [username]
        );

        if (rows.length === 0) {
            return null; // Usuario no encontrado
        }

        const promotor = rows[0];

        // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        const isPasswordValid = await compare_password(password, promotor.vc_password);
        
        if (!isPasswordValid) {
            return null; // Contraseña incorrecta
        }

        return promotor; // Usuario autenticado correctamente
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        throw error;
    }
}