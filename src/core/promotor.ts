import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';
import { hash_password, compare_password } from '../core/utils';

//TODO: las fechas se formaran en UNIX_TIMESTAMP, por lo que se guardaran como enteros
export interface Promotor {
    id_promotor?: number;
    vc_username: string;
    vc_password: string;
}

export interface PromotorDetalle {
    id_promotor_detalle?: number;
    id_promotor: number;
    vc_nombre: string;
    vc_apellido_paterno: string;
    vc_apellido_materno: string;
    dt_fecha_nacimiento: number;
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

export const create_promotor_detalle = async (promotorDetalle: PromotorDetalle): Promise<number> => {
    try {
        const { id_promotor, vc_nombre, vc_apellido_paterno, vc_apellido_materno, dt_fecha_nacimiento } = promotorDetalle;
        
        // Usa placeholders (?) para los valores
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO promotor_detalles (id_promotor, vc_nombre, vc_apellido_paterno, vc_apellido_materno, dt_fecha_nacimiento) VALUES (?, ?, ?, ?, ?)',
            [id_promotor, vc_nombre, vc_apellido_paterno, vc_apellido_materno, dt_fecha_nacimiento]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear detalle de usuario admin:', error);
        throw error;
    }
}

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

export const obtener_detalles_promotor = async (id_promotor: number): Promise<PromotorDetalle | null> => {
    try {
        const [rows] = await pool.query<any[]>(
            'SELECT id_promotor_detalle, id_promotor, vc_nombre, vc_apellido_paterno, vc_apellido_materno, dt_fecha_nacimiento FROM promotor_detalles WHERE id_promotor = ? LIMIT 1',
            [id_promotor]
        );

        if (rows.length === 0) {
            return null; // Detalles no encontrados
        }

        return rows[0]; // Detalles encontrados
    } catch (error) {
        console.error('Error al obtener detalles del promotor:', error);
        throw error;
    }
}