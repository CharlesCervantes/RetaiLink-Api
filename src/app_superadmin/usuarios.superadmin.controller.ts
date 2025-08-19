import { Request, Response } from 'express';

import { compare_password, generate_token, TokenPayload } from '../core/utils';

import pool from '../config/database';

import { get_user, create_user, get_user_by_username, get_all_users, update_user, delete_user } from '../core/usuarios';
import { User } from '../core/interfaces';

export const registrar_usuario = async (req: Request, res: Response) => {
    const connection_db = await pool.getConnection();
    await connection_db.beginTransaction(); 

    try {
        const { vc_username, vc_password, vc_nombre, id_negocio, i_rol } = req.body;

        if (!vc_username || !vc_password || !vc_nombre) {
            throw new Error('Username, password, and name are required');
        }

        const existingUser = await get_user(vc_username);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser: User = {
            vc_username,
            vc_password,
            vc_nombre,
            id_negocio,
            i_rol,
        };

        const userId = await create_user(newUser, connection_db);

        if (!userId) {
            throw new Error('Failed to create user');
        }

        // Generar token JWT después del registro
        const token = generate_token({
            id: userId,
            vc_username,
        });

        await connection_db.commit();

        const user: User = {
            id_usuario: userId,
            vc_username,
            vc_nombre,
            vc_password: '', // No devolver la contraseña en la respuesta
            b_activo: true,
            dt_registro: Math.floor(Date.now() / 1000),
            dt_actualizacion: Math.floor(Date.now() / 1000),
            id_negocio,
            i_rol,
        };

        return res.status(201).json({
            ok: true,
            data: {
                "user": user,
                "token": token,
            },
            message: 'User created successfully',
        });

    } catch (error) {
        await connection_db.rollback(); // 🔴 Deshacer la transacción en caso de error
        console.error('Error creating user:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: error instanceof Error ? error.message : 'Internal error',
        });
    } finally {
        connection_db.release(); // 🔸 Liberar la conexión SIEMPRE
    }
};

export const login_usuario = async (req: Request, res: Response) => {
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
        const existingUser = await get_user_by_username(user.vc_username);
        if (!existingUser) {
            throw new Error('User does not exist');
        }
        
        // Check if the password is correct
        const isPasswordValid = await compare_password(user.vc_password, existingUser.vc_password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        
        // Generar token JWT
        const tokenPayload: TokenPayload = {
            id: existingUser.id_usuario!,
            vc_username: existingUser.vc_username
        };
        
        const token = generate_token(tokenPayload);
        
        // Devolver usuario sin la contraseña y el token
        const { vc_password: _, ...userWithoutPassword } = existingUser;
        
        return res.status(200).json({
            ok: true,
            data: {
                user: userWithoutPassword,
                token,
            },
            message: 'User logged in successfully',
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const obtener_usuario = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

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

        // Ocultar contraseña
        delete (user as any).vc_password;

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
export const obtener_lista_usuarios = async (_req: Request, res: Response) => {
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
export const actualizar_usuario = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

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
        const existing = await get_user(id, connection);
        if (!existing) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Usuario no encontrado'
            });
        }

        const updatedUser = await update_user(id, user, connection);
        if (!updatedUser) {
            throw new Error('No se pudo actualizar el usuario');
        }

        await connection.commit();

        return res.status(200).json({
            ok: true,
            data: updatedUser,
            message: 'Usuario actualizado exitosamente'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    } finally {
        connection.release();
    }
};

// Eliminar un usuario (eliminación lógica)
export const eliminar_usuario = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
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
        
        const deleted = await delete_user(id, connection);
        
        if (!deleted) {
            return res.status(400).json({
                ok: false,
                data: null,
                message: 'No se pudo eliminar el usuario'
            });
        }

        await connection.commit();
        
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

