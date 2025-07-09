import { Request, Response } from 'express';
import {
    create_pregunta_negocio,
    get_preguntas_by_negocio,
    update_pregunta_negocio,
    delete_pregunta_negocio
} from '../core/preguntas_negocio';
import { PreguntaNegocio } from '../core/interfaces';

// Crear relación pregunta-negocio
export const crear_pregunta_negocio = async (req: Request, res: Response) => {
    try {
        const data: PreguntaNegocio = req.body;

        if (!data.id_pregunta || !data.id_negocio || data.dc_precio === undefined) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'id_pregunta, id_negocio y dc_precio son requeridos'
            });
        }

        const id = await create_pregunta_negocio(data);

        return res.status(201).json({
            ok: true,
            data: { id_pregunta_negocio: id },
            message: 'Relación creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear pregunta_negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todas las preguntas de un negocio
export const obtener_preguntas_negocio = async (req: Request, res: Response) => {
    try {
        const { id_negocio } = req.params;

        if (!id_negocio) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'id_negocio es requerido'
            });
        }

        const preguntas = await get_preguntas_by_negocio(Number(id_negocio));

        return res.status(200).json({
            ok: true,
            data: preguntas,
            message: 'Relaciones obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener preguntas del negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar relación
export const actualizar_pregunta_negocio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data: Partial<PreguntaNegocio> = req.body;

        const updated = await update_pregunta_negocio(Number(id), data);

        if (!updated) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Relación no encontrada o sin cambios'
            });
        }

        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Relación actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar pregunta_negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar (desactivar) relación
export const eliminar_pregunta_negocio = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await delete_pregunta_negocio(Number(id));

        if (!deleted) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Relación no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Relación desactivada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar pregunta_negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

