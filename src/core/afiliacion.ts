import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export interface Afiliacion {
    id_afiliacion?: number; // ID de la afiliación
    id_promotor_afiliado: number;
    id_promotor_origen: number; // ID del promotor que originó la afiliación
    dt_creacion: number;
}

export const create_afiliacion = async (afiliacion: Afiliacion, connection: PoolConnection): Promise<number> => {
    try {
        const epochTime = Math.floor(Date.now() / 1000);
        const { id_promotor_afiliado, id_promotor_origen } = afiliacion;
        
        // Usa placeholders (?) para los valores
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO afiliaciones (id_promotor_afiliado, id_promotor_origen, dt_creacion) VALUES (?, ?, ?);',
            [id_promotor_afiliado, id_promotor_origen, epochTime]
        );
        
        return result.insertId;
    }
    catch (error) {
        console.error('Error al crear afiliación:', error);
        throw error;
    }
}

export const get_promotorId_by_afiliacion = async (afiliacion: string, connection: PoolConnection): Promise<number | null> => {
    try {
        const [rows] = await connection.query<any[]>(
            'SELECT id_promotor FROM promotores WHERE vc_codigo_afiliacion = ? LIMIT 1',
            [afiliacion]
        );
        if (rows.length === 0) {
            return null; // No se encontró el promotor
        }
        return rows[0].id_promotor; // Retorna el ID del promotor
    } catch (error) {
        console.error('Error al obtener ID de promotor por afiliación:', error);
        throw error;
    }
}