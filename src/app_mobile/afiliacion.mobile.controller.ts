import { Request, Response } from 'express';
import { getAfiliacionesByPromotor } from '../core/afiliacion';
import pool from '../config/database';

export const obtener_listado_afiliacions_por_promotor = async(req: Request, res: Response) => {
    try {
        const { id_promotor } = req.params;
        const connection_db = await pool.getConnection();
        const afiliaciones = await getAfiliacionesByPromotor(parseInt(id_promotor), connection_db);
        connection_db.release();

        return res.status(200).json({
            ok: true,
            data: afiliaciones,
            message: 'Listado de afiliaciones obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener listado de afiliaciones por promotor:', error);
        return res.status(500).json({
            ok: false,
            data: error,
            message: 'Error interno del servidor al obtener afiliaciones'
        });
    }
}
