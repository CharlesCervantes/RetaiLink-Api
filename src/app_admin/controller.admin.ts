import { Request, Response } from 'express';
import { 
    create_establecimiento, 
    get_establecimiento, 
    get_all_establecimientos, 
    update_establecimiento, 
    delete_establecimiento, 
    hard_delete_establecimiento,
    search_establecimientos
} from '@/core/establecimientos';

import {
    create_user,
    get_user,
    get_all_users,
    update_user,
    delete_user,
} from '@/core/usuarios';

import { compare_password } from '@/core/utils';

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

export const registerUser = async (req: Request, res: Response) => {
    try {
        const {vc_username, vc_password} = req.body;
        if (!vc_username || !vc_password) {
            throw new Error('Username and password are required');
        }
        const user = {
            vc_username,
            vc_password
        };

        // Check if the user already exists
        const existingUser = await get_user(user.vc_username);
        if (existingUser) {
           throw new Error('User already exists');
        }

        const userId = await create_user(user);
        return res.status(201).json({
            ok: true,
            data: userId,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: error
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {vc_username, vc_password} = req.body;
        if (!vc_username || !vc_password) {
            throw new Error('Username and password are required');
        }
        const user = {
            vc_username,
            vc_password
        };

        // Check if the user exists
        const existingUser = await get_user(user.vc_username);
        if (!existingUser) {
           throw new Error('User does not exist');
        }

        // Check if the password is correct
        const isPasswordValid = await compare_password(user.vc_password, existingUser.vc_password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return res.status(200).json({
            ok: true,
            data: existingUser,
            message: 'User logged in successfully',
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: error
        });
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de usuario inválido'
            });
        }
        
        const user = await get_user(id);
        
        if (!user) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Usuario no encontrado'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: user,
            message: 'Usuario obtenido exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

// Obtener todos los usuarios
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await get_all_users();
        
        return res.status(200).json({
            ok: true,
            data: users,
            message: 'Usuarios obtenidos exitosamente'
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { user } = req.body;
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de usuario inválido'
            });
        }
        
        if (!user) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'Datos del usuario requeridos'
            });
        }
        
        // Verificar si el usuario existe
        const existing = await get_user(id);
        
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Usuario no encontrado'
            });
        }
        
        const updated = await update_user(id, user);
        
        if (!updated) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo actualizar el usuario'
            });
        }
        
        // Obtener el usuario actualizado
        const updatedUser = await get_user(id);
        
        return res.status(200).json({
            ok: true,
            data: updatedUser,
            message: 'Usuario actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

// Eliminar un usuario (eliminación lógica)
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'ID de usuario inválido'
            });
        }
        
        // Verificar si el usuario existe
        const existing = await get_user(id);
        
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Usuario no encontrado'
            });
        }
        
        const deleted = await delete_user(id);
        
        if (!deleted) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo eliminar el usuario'
            });
        }
        
        return res.status(200).json({
            ok: true,
            data: null,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}
