import { Request, Response } from 'express';
import {create_promotor, verify_promotor} from '../core/promotor'
import { generate_token } from '../core/utils';
import pool from '../config/database';

export const crear_promotor = async (req: Request, res: Response) => {
    const connection_db = await pool.getConnection();
    await connection_db.beginTransaction(); // 🔸 Iniciar transacción

    try {
        const {vc_username, vc_password, vc_nombre, dt_fecha_nacimiento } = req.body;

        if (!vc_username || !vc_password || !vc_nombre || !dt_fecha_nacimiento) {
            return res.status(400).json({message: 'Todos los campos son obligatorios'});
        }

        const promotorId = await create_promotor(req.body, connection_db);

        if (!promotorId) {
            await connection_db.rollback(); // 🔸 Revertir transacción en caso de error
            return res.status(400).json({message: 'No se pudo crear el promotor'});
        }

        return res.status(201).json({
            ok: true,
            data: promotorId,
            message: 'Promotor created successfully',
        });
    } catch (error) {
        await connection_db.rollback(); // 🔴 Deshacer la transacción en caso de error
        console.error('Error creating promotor:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const login_promotor = async (req: Request, res: Response) => {
    try {
        const { vc_username, vc_password } = req.body;

        if (!vc_username || !vc_password) {
            return res.status(400).json({ 
                ok: false,
                message: 'El nombre de usuario y la contraseña son obligatorios' 
            });
        }

        const promotor = await verify_promotor(vc_username, vc_password);

        if (!promotor) {
            return res.status(401).json({ 
                ok: false,
                message: 'Credenciales inválidas' 
            });
        }

        // Aquí podrías generar un token JWT si quieres implementar autenticación con tokens
        const token = generate_token({
            id: promotor.id_promotor!,
            vc_username: promotor.vc_username
        });

        return res.status(200).json({
            ok: true,
            data: {
                token: token,
                user: {
                    id_promotor: promotor.id_promotor,
                    vc_username: promotor.vc_username,
                    vc_nombre: promotor.vc_nombre,
                    dt_fecha_nacimiento: promotor.dt_fecha_nacimiento,
                    b_activo: promotor.b_activo,
                    dt_registro: promotor.dt_registro,
                    dt_actualizacion: promotor.dt_actualizacion
                }
            },
            message: 'Inicio de sesión exitoso'
        });
    } catch (error) {
        console.error('Error during promotor login:', error);
        return res.status(500).json({ 
            ok: false,
            message: 'Internal server error' 
        });
    }
};