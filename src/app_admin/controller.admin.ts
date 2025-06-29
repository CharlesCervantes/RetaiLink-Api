import { Request, Response } from 'express';
import { 
    create_establecimiento, 
    get_establecimiento, 
    get_all_establecimientos, 
    update_establecimiento, 
    delete_establecimiento, 
    hard_delete_establecimiento,
    search_establecimientos,
    conectar_establecimineto_negocio,
    desconectar_establecimiento_negocio
} from '../core/establecimientos';

import {
    create_user,
    create_usuario_negocio,
} from '../core/usuarios';

import {
    create_negocio,
    get_negocio,
    get_all_negocios,
    update_negocio,
} from '../core/negocios';

import pool from '../config/database';



// Crear un nuevo establecimiento
export const createEstablecimiento = async (req: Request, res: Response) => {
    try {
        const { establecimiento } = req.body;
        
        if (!establecimiento || !establecimiento.vc_nombre) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'El nombre del establecimiento es requerido'
            });
        }
        
        const new_establecimiento_id = await create_establecimiento(establecimiento);
        
        return res.status(201).json({
            ok: true,
            data: { id: new_establecimiento_id },
            message: 'Establecimiento creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear establecimiento:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}
// Obtener un establecimiento por ID
export const getEstablecimiento = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de establecimiento inválido'
            });
        }
        
        const establecimiento = await get_establecimiento(id);
        
        if (!establecimiento) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Establecimiento no encontrado'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: establecimiento,
            message: 'Establecimiento obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener establecimiento:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}
// Obtener todos los establecimientos
export const getAllEstablecimientos = async (req: Request, res: Response) => {
    try {
        // Comprobar si hay un término de búsqueda
        const { search } = req.query;
        
        let establecimientos;
        
        if (search && typeof search === 'string') {
            establecimientos = await search_establecimientos(search);
        } else {
            establecimientos = await get_all_establecimientos();
        }
        
        return res.status(200).json({
            ok: true,
            data: establecimientos,
            message: 'Establecimientos obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener establecimientos:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}
// Actualizar un establecimiento
export const updateEstablecimiento = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { establecimiento } = req.body;
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de establecimiento inválido'
            });
        }
        
        if (!establecimiento) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'Datos del establecimiento requeridos'
            });
        }
        
        // Verificar si el establecimiento existe
        const existing = await get_establecimiento(id);
        
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Establecimiento no encontrado'
            });
        }
        
        const updated = await update_establecimiento(id, establecimiento);
        
        if (!updated) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo actualizar el establecimiento'
            });
        }
        
        // Obtener el establecimiento actualizado
        const updatedEstablecimiento = await get_establecimiento(id);
        
        return res.status(200).json({
            ok: true,
            data: updatedEstablecimiento,
            message: 'Establecimiento actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar establecimiento:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}
// Eliminar un establecimiento (eliminación lógica)
export const deleteEstablecimiento = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de establecimiento inválido'
            });
        }
        
        // Verificar si el establecimiento existe
        const existing = await get_establecimiento(id);
        
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Establecimiento no encontrado'
            });
        }
        
        const deleted = await delete_establecimiento(id);
        
        if (!deleted) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo eliminar el establecimiento'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Establecimiento eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar establecimiento:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}
// Eliminar un establecimiento permanentemente (eliminación física)
export const hardDeleteEstablecimiento = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de establecimiento inválido'
            });
        }
        
        const deleted = await hard_delete_establecimiento(id);
        
        if (!deleted) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Establecimiento no encontrado o no se pudo eliminar'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Establecimiento eliminado permanentemente'
        });
    } catch (error) {
        console.error('Error al eliminar permanentemente establecimiento:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}


// Crear un nuevo negocio
export const createNegocio = async (req: Request, res: Response) => {
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
        const user = {
            vc_username: defaultUsername,
            vc_password: defaultPassword,
            vc_nombre: negocio.vc_nombre,
        };
        const new_user_id = await create_user(user, connection);

        // Crear relación usuario-negocio
        const usuario_negocio = {
            id_usuario: new_user_id,
            id_negocio: new_negocio_id
        };
        await create_usuario_negocio(usuario_negocio, connection);

        // Confirmar transacción
        await connection.commit();
        
        return res.status(201).json({
            ok: true,
            data: { id: new_negocio_id },
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
export const getNegocio = async (req: Request, res: Response) => {
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
export const getAllNegocios = async (_req: Request, res: Response) => {
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
export const updateNegocio = async (req: Request, res: Response) => {
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
        const existing = await get_negocio(id);
        
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Negocio no encontrado'
            });
        }
        
        const updated = await update_negocio(id, negocio);
        
        if (!updated) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo actualizar el negocio'
            });
        }
        
        // Obtener el negocio actualizado
        const updatedNegocio = await get_negocio(id);
        
        return res.status(200).json({
            ok: true,
            data: updatedNegocio,
            message: 'Negocio actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

// Eliminar un negocio (eliminación lógica)
export const deleteNegocio = async (req: Request, res: Response) => {
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
        
        const deleted = await delete_establecimiento(id);
        
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

export const conectarEstablecimientoNegocio = async (req: Request, res: Response) => {
    const connection = await pool.getConnection(); // Obtener conexión para la transacción
    try {
        const { id_establecimiento, id_negocio } = req.body;
        
        if (!id_establecimiento || !id_negocio) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de establecimiento y negocio son requeridos'
            });
        }

        // Crear la relación entre el establecimiento y el negocio
        const newEstablecimientoNegocioId = await conectar_establecimineto_negocio(id_establecimiento, id_negocio, connection);
        
        return res.status(201).json({
            ok: true,
            data: { id: newEstablecimientoNegocioId },
            message: 'Relación entre establecimiento y negocio creada exitosamente'
        });
    } catch (error) {
        console.error('Error al conectar establecimiento y negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

export const desconectarEstablecimientoNegocio = async (req: Request, res: Response) => {
    const connection = await pool.getConnection(); // Obtener conexión para la transacción
    try {
        const { id_establecimiento, id_negocio } = req.body;
        
        if (!id_establecimiento || !id_negocio) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de establecimiento y negocio son requeridos'
            });
        }

        // Desconectar el establecimiento del negocio
        const disconnected = await desconectar_establecimiento_negocio(id_establecimiento, id_negocio, connection);
        
        if (!disconnected) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo desconectar el establecimiento del negocio'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Establecimiento desconectado del negocio exitosamente'
        });
    } catch (error) {
        console.error('Error al desconectar establecimiento y negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}