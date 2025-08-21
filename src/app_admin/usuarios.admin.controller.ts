import { Request, Response } from 'express';
import { compare_password, generate_token, TokenPayload } from '../core/utils';
import { get_user_by_username, get_all_users_by_buisness, get_user, create_user } from '../core/usuarios';
import pool from '../config/database';
import { User } from '@/core/interfaces';

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

export const obtener_usuarios_negocio = async(req: Request, res: Response) =>{
    try {
        const { id_negocio } = req.body;

        if (!id_negocio) {
            throw new Error('id_negocio is required');
        }

        const usuarios = await get_all_users_by_buisness(id_negocio);

        return res.status(200).json({
            ok: true,
            data: usuarios,
            message: 'Usuarios obtenidos exitosamente'
        });

    } catch (error) {
        console.error('Error obtener_usuarios_negocio:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const registrar_usuario_negocio = async (req: Request, res: Response) => {
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
            i_rol: 2 // aqui simpre se crearen usuarios admin, no superadsmin
        };

        const userId = await create_user(newUser, connection_db);

        if (!userId) {
            throw new Error('Failed to create user');
        }


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
            data: user,
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