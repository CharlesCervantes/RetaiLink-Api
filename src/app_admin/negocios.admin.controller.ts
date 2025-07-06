import { Request, Response } from 'express';
import pool from '../config/database';

import { create_negocio, get_negocio, get_all_negocios, update_negocio, delete_negocio } from '../core/negocios';
import { create_user } from '../core/usuarios';
import { User } from '../core/interfaces';

// Crear un nuevo negocio
export const crear_negocio = async (req: Request, res: Response) => {
    const connection = await pool.getConnection(); // Obtener conexión para la transacción
    try {
        const { negocio } = req.body;
        
        if (!negocio || !negocio.vc_nombre) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'El nombre del negocio es requerido'
            });
        }

        await connection.beginTransaction(); // Iniciar transacción

        // Verificar si el negocio ya existe
        const existingNegocio = await get_negocio(negocio.vc_nombre);
        if (existingNegocio) {
            return res.status(409).json({
                ok: false,
                data: null,
                message: 'El negocio ya existe'
            });
        }
        
        const new_negocio_id = await create_negocio(negocio, connection);

        const defaultUsername = `${negocio.vc_nombre.toLowerCase().replace(/\s+/g, '')}@default.com`;
        const defaultPassword = 'defaultPassword123'; // Cambiar por una contraseña segura
        const user: User = {
            vc_username: defaultUsername,
            vc_password: defaultPassword,
            vc_nombre: negocio.vc_nombre,
            id_negocio: new_negocio_id, // Asociar el usuario al nuevo negocio
        };
        const new_user_id = await create_user(user, connection);

        // Confirmar transacción
        await connection.commit();
        
        return res.status(201).json({
            ok: true,
            data: {
                negocio: {
                    id_negocio: new_negocio_id,
                    vc_nombre: negocio.vc_nombre,
                },
                user: {
                    id_usuario: new_user_id,
                    vc_username: defaultUsername,
                    vc_nombre: negocio.vc_nombre,
                    b_activo: true,
                    dt_registro: Math.floor(Date.now() / 1000),
                    dt_actualizacion: Math.floor(Date.now() / 1000),
                    id_negocio: new_negocio_id, // Asociar el usuario al negocio
                }
            },
            message: 'Negocio creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear negocio:', error);

        // Revertir transacción en caso de error
        await connection.rollback();

        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });

    } finally {
        connection.release(); // Liberar conexión
    }
}

// Obtener un negocio por ID
export const obtener_negocio = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de negocio inválido'
            });
        }
        
        const negocio = await get_negocio(id);
        
        if (!negocio) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Negocio no encontrado'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: negocio,
            message: 'Negocio obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

// Obtener todos los negocios
export const obtener_lista_negocios = async (_req: Request, res: Response) => {
    try {
        const negocios = await get_all_negocios();
        
        return res.status(200).json({
            ok: true,
            data: negocios,
            message: 'Negocios obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener negocios:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

// Actualizar un negocio
export const actualizar_negocio = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction(); // Iniciar transacción

    try {
        const id = parseInt(req.params.id);
        const { negocio } = req.body;
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de negocio inválido'
            });
        }
        
        if (!negocio) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'Datos del negocio requeridos'
            });
        }
        
        // Verificar si el negocio existe
        const existing = await get_negocio(id, connection);
        
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Negocio no encontrado'
            });
        }
        
        const updated = await update_negocio(id, negocio, connection);
        
        if (!updated) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo actualizar el negocio'
            });
        }
        
        // Obtener el negocio actualizado
        const updatedNegocio = await get_negocio(id, connection);

        await connection.commit(); // Confirmar transacción
        
        return res.status(200).json({
            ok: true,
            data: updatedNegocio,
            message: 'Negocio actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar negocio:', error);
        await connection.rollback(); // Revertir transacción en caso de error
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

// Eliminar un negocio (eliminación lógica)
export const eliminar_negocio = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de negocio inválido'
            });
        }
        
        // Verificar si el negocio existe
        const existing = await get_negocio(id);
        
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Negocio no encontrado'
            });
        }
        
        const deleted = await delete_negocio(id);
        
        if (!deleted) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo eliminar el negocio'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Negocio eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}