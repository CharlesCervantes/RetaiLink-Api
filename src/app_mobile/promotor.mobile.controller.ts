import { Request, Response } from 'express';
import {create_promotor, verify_promotor, generarCodigoUnico, Promotor} from '../core/promotor'
import { create_cuenta_promotor, cuentas_promotores } from '../core/cuentas_promotores';
import { create_afiliacion, get_promotorId_by_afiliacion} from '../core/afiliacion';
import { generate_token } from '../core/utils';
import pool from '../config/database';

export const crear_promotor = async (req: Request, res: Response) => {
    const epochTime = Math.floor(Date.now() / 1000);
    const connection_db = await pool.getConnection();
    await connection_db.beginTransaction();

    try {
        const { vc_username, vc_password, vc_nombre, dt_fecha_nacimiento, afiliacion } = req.body;

        if (!vc_username || !vc_password || !vc_nombre || !dt_fecha_nacimiento) {
            return res.status(400).json({
                ok: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const codigo_afiliacion = await generarCodigoUnico(connection_db);

        const promotor_payload: Promotor = {
            vc_nombre,
            vc_username,
            vc_password,
            dt_fecha_nacimiento,
            vc_codigo_afiliacion: codigo_afiliacion,
        }

        const promotorId = await create_promotor(promotor_payload, connection_db);

        if (!promotorId) {
            throw new Error('No se pudo crear el promotor');
        }

        const cuenta: cuentas_promotores = {
            id_promotor: promotorId,
            dc_saldo_actual: 0,
            dc_saldo_disponible: 0,
            dc_saldo_pendiente: 0,
            vc_moneda: '',
            b_activa: false,
            dt_creacion: epochTime,
            dt_actualizacion: epochTime
        }
        const cuentaId = await create_cuenta_promotor(cuenta, connection_db);

        const token = generate_token({
            id: promotorId,
            vc_username,
        });

        if (afiliacion){
            const promotorIdAfiliado = await get_promotorId_by_afiliacion(afiliacion, connection_db);

            if(promotorIdAfiliado !== null && promotorIdAfiliado > 0) {
                await create_afiliacion({
                id_promotor_afiliado: promotorId,
                id_promotor_origen: promotorIdAfiliado,
                dt_creacion: epochTime
            }, connection_db);
            }
        }

        await connection_db.commit();

         // Obtener promotor actualizado (si no tienes ya todos los campos)
        const promotor = {
            id_promotor: promotorId,
            vc_username,
            vc_nombre,
            dt_fecha_nacimiento,
            vc_codigo_afiliacion: codigo_afiliacion,
            b_activo: true,
            dt_registro: epochTime,
            dt_actualizacion: epochTime,
            cuenta: {
                id_cuenta: cuentaId,
                dc_saldo_actual: 0,
                dc_saldo_disponible: 0,
                dc_saldo_pendiente: 0,
                vc_moneda: 'MXN',
                b_activa: true,
                dt_creacion: epochTime,
                dt_actualizacion: epochTime
            }
        };

        return res.status(201).json({
            ok: true,
            message: 'Promotor creado y autenticado exitosamente',
            data: {
                token,
                promotor
            }
        });

    } catch (error) {
        await connection_db.rollback();
        console.error('Error al crear promotor:', error);
        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor'
        });
    } finally {
        connection_db.release();
    }
};

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
            vc_username: promotor.vc_username,
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
