import { Request, Response } from "express";
import { create_pedido_plantilla, get_pedido_plantilla_list, get_pedido_plantilla, update_pedido_plantilla, delete_pedido_plantilla } from "../core/pedido";
import pool from '../config/database';

export const crear_pedido_plantilla = async (req: Request, res: Response) => {
    try {
        const connection_db = await pool.getConnection();
        await connection_db.beginTransaction();
        const { id_negocio, id_usuario, vc_titulo, vc_descripcion } = req.body;

        if (!id_negocio || !id_usuario || !vc_titulo) {
        return res.status(400).json({ ok: false, message: "Datos incompletos" });
        }

        const epoch = Math.floor(Date.now() / 1000);
        const result = await create_pedido_plantilla({
        id_negocio,
        id_usuario,
        vc_titulo,
        vc_descripcion,
        dt_fecha_creacion: epoch,
        dt_fecha_actualizacion: epoch
        }, epoch, connection_db);

        if (result.error) {
        return res.status(500).json({ ok: false, message: result.message });
        }

        await connection_db.commit();

        return res.status(201).json({
        ok: true,
        data: result.data,
        message: result.message,
        });
    } catch (error) {
        console.error("Error al crear plantilla de pedido:", error);
        return res.status(500).json({
        ok: false,
        message: "Error interno al crear plantilla de pedido",
        });
    }
};

export const obtener_pedido_plantilla = async (req: Request, res: Response) => {
    try {
        
        const { id_negocio } = req.body;

        if (!id_negocio) {
            return res.status(400).json({
                ok: false,
                message: 'El ID del negocio es obligatorio'
            });
        }

        const connection_db = await pool.getConnection();
        const plantillas = await get_pedido_plantilla_list(id_negocio, connection_db);

        return res.status(200).json({
            ok: true,
            data: plantillas,
            message: 'Plantillas de pedido obtenidas exitosamente'
        });

    } catch (error) {
        console.error('Error al obtener plantillas de pedido:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

export const obtener_pedido_plantilla_por_id = async (req: Request, res: Response) => {
    try {
        const { id_pedido_plantilla } = req.body;

        if (!id_pedido_plantilla) {
            return res.status(400).json({
                ok: false,
                message: 'El ID de la plantilla de pedido es obligatorio'
            });
        }

        const connection_db = await pool.getConnection();
        const plantilla = await get_pedido_plantilla(id_pedido_plantilla, connection_db);

        if (!plantilla.data) {
            return res.status(404).json({
                ok: false,
                message: 'Plantilla de pedido no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            data: plantilla.data,
            message: 'Plantilla de pedido obtenida exitosamente'
        });

    } catch (error) {
        console.error('Error al obtener plantilla de pedido por ID:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

export const actualizar_pedido_plantilla = async (req: Request, res: Response) => {
    try {
        const connection_db = await pool.getConnection();
        await connection_db.beginTransaction();
        const { id_pedido_plantilla, id_negocio, id_usuario, vc_titulo, vc_descripcion } = req.body;

        if (!id_pedido_plantilla || !id_negocio || !id_usuario || !vc_titulo) {
            return res.status(400).json({ ok: false, message: "Datos incompletos" });
        }

        const epoch = Math.floor(Date.now() / 1000);
        const result = await update_pedido_plantilla({
            id_pedido_plantilla,
            id_negocio,
            id_usuario,
            vc_titulo,
            vc_descripcion,
            dt_fecha_creacion: epoch,
            dt_fecha_actualizacion: epoch
        }, epoch, connection_db);

        if (result.error) {
            return res.status(500).json({ ok: false, message: result.message });
        }

        await connection_db.commit();

        return res.status(200).json({
            ok: true,
            data: null,
            message: "Plantilla de pedido actualizada correctamente",
        });
    } catch (error) {
        console.error("Error al actualizar plantilla de pedido:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno al actualizar plantilla de pedido",
        });
    }
};

export const eliminar_pedido_plantilla = async (req: Request, res: Response) => {
    try {
        const connection_db = await pool.getConnection();
        await connection_db.beginTransaction();
        const { id_pedido_plantilla } = req.body;

        if (!id_pedido_plantilla) {
            return res.status(400).json({ ok: false, message: "ID de plantilla de pedido requerido" });
        }

        const epoch = Math.floor(Date.now() / 1000);
        const result = await delete_pedido_plantilla(id_pedido_plantilla, epoch, connection_db);

        if (result.error) {
            return res.status(500).json({ ok: false, message: result.message });
        }

        await connection_db.commit();

        return res.status(200).json({
            ok: true,
            data: null,
            message: "Plantilla de pedido eliminada correctamente",
        });
    } catch (error) {
        console.error("Error al eliminar plantilla de pedido:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno al eliminar plantilla de pedido",
        });
    }
};