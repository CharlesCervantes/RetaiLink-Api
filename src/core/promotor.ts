import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';
import { hash_password, compare_password } from '../core/utils';
import { PoolConnection } from 'mysql2/promise';
import { generarCodigoAfiliacion } from './utils'

//TODO: las fechas se formaran en UNIX_TIMESTAMP, por lo que se guardaran como enteros
export interface Promotor {
    id_promotor?: number;
    vc_username: string;
    vc_password: string;
    vc_nombre: string;
    dt_fecha_nacimiento: number;
    b_activo?: boolean; // Por defecto true
    dt_registro?: number; // Fecha de registro en formato UNIX_TIMESTAMP
    dt_actualizacion?: number; // Fecha de actualización en formato UNIX_TIMESTAMP,
    vc_codigo_afiliacion: string; // Código de afiliación único
}

// export interface PromotorDetalle {
//     id_promotor_detalle?: number;
//     id_promotor: number;
//     vc_nombre: string;
//     vc_apellido_paterno: string;
//     vc_apellido_materno: string;
//     dt_fecha_nacimiento: number;
// }

// TODO: agregar validaciones para el usuario y la contraseña
export const create_promotor = async (promotor: Promotor, connection: PoolConnection): Promise<number> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        const { vc_username, vc_password, vc_nombre, dt_fecha_nacimiento, vc_codigo_afiliacion  } = promotor;
        const hashedPassword = await hash_password(vc_password);
        
        // Usa placeholders (?) para los valores
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO promotores (vc_username, vc_password, vc_nombre, dt_fecha_nacimiento, dt_registro, dt_actualizacion, vc_codigo_afiliacion) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [vc_username, hashedPassword, vc_nombre, dt_fecha_nacimiento, epochTime, epochTime, vc_codigo_afiliacion]
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
            'SELECT id_promotor, vc_username, vc_password, vc_nombre, dt_fecha_nacimiento, vc_codigo_afiliacion, dt_registro, b_activo FROM promotores WHERE vc_username = ? LIMIT 1',
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

export async function generarCodigoUnico(connection: PoolConnection): Promise<string> {
    let codigo;
    let existe = true;

    while (existe) {
        codigo = generarCodigoAfiliacion();
        const [rows] = await connection.query(
        'SELECT 1 FROM promotores WHERE vc_codigo_afiliacion = ?',
        [codigo]
        );
        existe = Array.isArray(rows) && rows.length > 0;
    }

    return codigo || "";
}

