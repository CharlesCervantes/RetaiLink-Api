import { Request, Response } from 'express';
import {
    create_pregunta,
    get_pregunta_by_id,
    get_all_preguntas,
    update_pregunta,
    delete_pregunta,
    get_preguntas_by_tipo,
    get_preguntas_by_evidencia,
    Pregunta
} from '../core/preguntas';

// Crear nueva pregunta
export const crear_pregunta = async (req: Request, res: Response) => {
    try {
        const pregunta: Pregunta = req.body;

        if (!pregunta.vc_pregunta || !pregunta.vc_tipo) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'La pregunta y el tipo son requeridos'
            });
        }

        const id_pregunta = await create_pregunta(pregunta);

        return res.status(201).json({
            ok: true,
            data: { id_pregunta },
            message: 'Pregunta creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear pregunta:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todas las preguntas activas
export const obtener_todas_preguntas = async (_req: Request, res: Response) => {
    try {
        const preguntas = await get_all_preguntas();
        return res.status(200).json({
            ok: true,
            data: preguntas,
            message: 'Preguntas obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener pregunta por ID
export const obtener_pregunta_por_id = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pregunta = await get_pregunta_by_id(Number(id));

        if (!pregunta) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Pregunta no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            data: pregunta,
            message: 'Pregunta obtenida exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener pregunta:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar pregunta
export const actualizar_pregunta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pregunta: Pregunta = req.body;

        await update_pregunta(Number(id), pregunta);

        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Pregunta actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar pregunta:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar (desactivar) pregunta
export const eliminar_pregunta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await delete_pregunta(Number(id));

        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Pregunta desactivada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener preguntas por tipo
export const obtener_preguntas_por_tipo = async (req: Request, res: Response) => {
    try {
        const { tipo } = req.params;
        const preguntas = await get_preguntas_by_tipo(tipo);

        return res.status(200).json({
            ok: true,
            data: preguntas,
            message: 'Preguntas obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener preguntas por tipo:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener preguntas por evidencia requerida
export const obtener_preguntas_por_evidencia = async (req: Request, res: Response) => {
    try {
        const { evidencia } = req.params;
        const b_evidencia = evidencia === 'true'; // Convertir a boolean

        const preguntas = await get_preguntas_by_evidencia(b_evidencia);

        return res.status(200).json({
            ok: true,
            data: preguntas,
            message: 'Preguntas obtenidas exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener preguntas por evidencia:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
};
