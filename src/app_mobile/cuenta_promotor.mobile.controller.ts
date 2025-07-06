import { Request, Response } from 'express';
import {DepositoRequest, get_cuenta_by_promotor, realizar_deposito, realizar_retiro, RetiroRequest} from '../core/cuentas_promotores';
import pool from '../config/database';

export const obtener_cuenta_promotor = async (req: Request, res: Response) => {
    try {
        const { id_promotor } = req.body;

        if (!id_promotor) {
            return res.status(400).json({
                ok: false,
                message: 'El ID del promotor es obligatorio'
            });
        }

        const connection_db = await pool.getConnection();

        const cuenta = await get_cuenta_by_promotor(id_promotor, connection_db);

        if (!cuenta) {
            return res.status(404).json({
                ok: false,
                message: 'Cuenta del promotor no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            data: cuenta,
            message: 'Cuenta del promotor obtenida exitosamente'
        });

    } catch (error) {
        console.error('Error al obtener cuenta del promotor:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

export const realizar_deposito_promotor = async (req: Request, res: Response) => {
    try {
        const { id_promotor, monto, concepto, id_usuario_autorizo, referencia, metadata }: DepositoRequest = req.body;

        if (!id_promotor || !monto || !concepto || !id_usuario_autorizo) {
            return res.status(400).json({
                ok: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const deposito = await realizar_deposito({
            id_promotor,
            monto,
            concepto,
            id_usuario_autorizo,
            referencia,
            metadata
        });

        return res.status(200).json({
            ok: true,
            data: deposito,
            message: 'Depósito realizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al realizar depósito:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}

export const realizar_retiro_promotor = async (req: Request, res: Response) => {
    try {

        const {id_promotor, id_usuario_autorizo, concepto, monto, metadata, referencia }: RetiroRequest = req.body;

        if (!id_promotor || !monto || !concepto || !id_usuario_autorizo) {
            return res.status(400).json({
                ok: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const retiro = {
            id_promotor,
            monto,
            concepto,
            id_usuario_autorizo,
            referencia,
            metadata,
        };

        const retiro_operacion = await realizar_retiro(retiro)

        return res.status(200).json({
            ok: true,
            data: retiro_operacion,
            message: 'Retiro realizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al realizar retiro:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Error interno del servidor'
        });
    }
}