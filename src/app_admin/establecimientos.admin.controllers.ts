import { Request, Response } from "express";
import { create_establecimiento, get_all_establecimientos, get_establecimiento, update_establecimiento, delete_establecimiento } from '../core/establecimientos';
import pool from '../config/database';

export const crear_establecimiento = async (req: Request, res: Response) => {
    try {
        const connection_db = await pool.getConnection();
        await connection_db.beginTransaction();
        
        const establecimiento = req.body;

        if (!establecimiento.vc_nombre) {
            return res.status(400).json({ ok: false, message: "Nombre del establecimiento es obligatorio" });
        }

        const id_establecimiento = await create_establecimiento(establecimiento);
        
        await connection_db.commit();
        
        return res.status(201).json({
            ok: true,
            data: { id_establecimiento },
            message: "Establecimiento creado exitosamente"
        });
    } catch (error) {
        console.error("Error al crear establecimiento:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno al crear establecimiento"
        });
    }
};

export const obtener_establecimiento = async (req: Request, res: Response) => {
    try {
        const { id_establecimiento } = req.params;

        if (!id_establecimiento) {
            return res.status(400).json({ ok: false, message: "ID del establecimiento es obligatorio" });
        }

        const establecimiento = await get_establecimiento(Number(id_establecimiento));

        if (!establecimiento) {
            return res.status(404).json({ ok: false, message: "Establecimiento no encontrado" });
        }

        return res.status(200).json({
            ok: true,
            data: establecimiento
        });
    } catch (error) {
        console.error("Error al obtener establecimiento:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno al obtener establecimiento"
        });
    }
};

export const obtener_todos_establecimientos = async (_req: Request, res: Response) => {
    try {
        const establecimientos = await get_all_establecimientos();
        
        return res.status(200).json({
            ok: true,
            data: establecimientos
        });
    } catch (error) {
        console.error("Error al obtener todos los establecimientos:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno al obtener establecimientos"
        });
    }
};

export const actualizar_establecimiento = async (req: Request, res: Response) => {
    try {
        const { id_establecimiento } = req.params;
        const establecimiento = req.body;

        if (!id_establecimiento) {
            return res.status(400).json({ ok: false, message: "ID del establecimiento es obligatorio" });
        }

        const updated = await update_establecimiento(Number(id_establecimiento), establecimiento);

        if (!updated) {
            return res.status(404).json({ ok: false, message: "Establecimiento no encontrado o no actualizado" });
        }

        return res.status(200).json({
            ok: true,
            message: "Establecimiento actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar establecimiento:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno al actualizar establecimiento"
        });
    }
}

export const eliminar_establecimiento = async (req: Request, res: Response) => {
    try {
        const { id_establecimiento } = req.params;

        if (!id_establecimiento) {
            return res.status(400).json({ ok: false, message: "ID del establecimiento es obligatorio" });
        }

        const deleted = await delete_establecimiento(Number(id_establecimiento));

        if (!deleted) {
            return res.status(404).json({ ok: false, message: "Establecimiento no encontrado o no eliminado" });
        }

        return res.status(200).json({
            ok: true,
            message: "Establecimiento eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar establecimiento:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno al eliminar establecimiento"
        });
    }
};