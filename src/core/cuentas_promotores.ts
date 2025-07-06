import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface cuentas_promotores {
  id_cuenta?: number,
  id_promotor: number,
  dc_saldo_actual: number,
  dc_saldo_disponible: number,
  dc_saldo_pendiente: number,
  vc_moneda: string,
  b_activa: boolean,
  dt_creacion: number,
  dt_actualizacion: number
};

export interface movimientos_cuenta {
  id_movimiento?: number,
  id_cuenta: number,
  id_promotor: number,
  tipo_movimiento: 'INGRESO' | 'EGRESO' | 'TRANSFERENCIA_IN' | 'TRANSFERENCIA_OUT' | 'COMISION' | 'AJUSTE',
  dc_monto: number,
  dc_saldo_anterior: number,
  dc_saldo_nuevo: number,
  vc_concepto: string,
  vc_referencia?: string,
  id_usuario_autorizo?: number,
  en_estado: 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO' | 'RECHAZADO',
  dt_movimiento: number,
  dt_procesado?: number,
  json_metadata?: object
}

export interface DepositoRequest {
  id_promotor: number,
  monto: number,
  concepto: string,
  referencia?: string,
  id_usuario_autorizo?: number,
  metadata?: object
}

export interface RetiroRequest {
  id_promotor: number,
  monto: number,
  concepto: string,
  referencia?: string,
  id_usuario_autorizo?: number,
  metadata?: object
}



export const create_cuenta_promotor = async (cuenta: cuentas_promotores, connection?: PoolConnection): Promise<number> => {
  try {
    const { id_promotor, dt_creacion, dt_actualizacion} = cuenta;

    const query = 'INSERT INTO cuentas_promotores (id_promotor, dt_creacion, dt_actualizacion) VALUES (?, ?, ?);';
    const params = [id_promotor, dt_creacion, dt_actualizacion];

    const [rows] = connection
        ? await connection.query<ResultSetHeader>(query, params)
        : await pool.query<ResultSetHeader>(query, params);

    return rows.insertId;
  } catch (error) {
    console.error('Error al crear cuenta de promotor:', error);
    throw error;
  }
};

// Función para obtener cuenta por promotor
export const get_cuenta_by_promotor = async (id_promotor: number, connection?: PoolConnection): Promise<cuentas_promotores | null> => {
  try {
    const query = 'SELECT id_cuenta, id_promotor, dc_saldo_actual, dc_saldo_disponible, dc_saldo_pendiente, vc_moneda, b_activa, dt_creacion, dt_actualizacion FROM cuentas_promotores WHERE id_promotor = ? AND b_activa = true LIMIT 1;';
    const params = [id_promotor];
    
    const [rows] = connection
      ? await connection.query<RowDataPacket[]>(query, params)
      : await pool.query<RowDataPacket[]>(query, params);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    return {
      id_cuenta: row.id_cuenta,
      id_promotor: row.id_promotor,
      dc_saldo_actual: parseFloat(row.dc_saldo_actual),
      dc_saldo_disponible: parseFloat(row.dc_saldo_disponible),
      dc_saldo_pendiente: parseFloat(row.dc_saldo_pendiente),
      vc_moneda: row.vc_moneda,
      b_activa: Boolean(row.b_activa),
      dt_creacion: row.dt_creacion,
      dt_actualizacion: row.dt_actualizacion
    };
    
  } catch (error) {
    console.error('Error al obtener cuenta por promotor:', error);
    throw error;
  }
}

// Función para realizar depósito
export const realizar_deposito = async (depositoData: DepositoRequest): Promise<{ movimiento_id: number, nuevo_saldo: number }> => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // 1. Obtener cuenta actual
    const cuenta = await get_cuenta_by_promotor(depositoData.id_promotor, connection);
    if (!cuenta) {
      throw new Error('Cuenta no encontrada o inactiva');
    }
    
    // 2. Validar monto
    if (depositoData.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    
    // 3. Calcular nuevos saldos
    const saldo_anterior = cuenta.dc_saldo_actual;
    const saldo_nuevo = saldo_anterior + depositoData.monto;
    const nuevo_saldo_disponible = cuenta.dc_saldo_disponible + depositoData.monto;
    
    // 4. Crear movimiento
    const movimiento: movimientos_cuenta = {
      id_cuenta: cuenta.id_cuenta!,
      id_promotor: depositoData.id_promotor,
      tipo_movimiento: 'INGRESO',
      dc_monto: depositoData.monto,
      dc_saldo_anterior: saldo_anterior,
      dc_saldo_nuevo: saldo_nuevo,
      vc_concepto: depositoData.concepto,
      vc_referencia: depositoData.referencia,
      id_usuario_autorizo: depositoData.id_usuario_autorizo,
      en_estado: 'COMPLETADO',
      dt_movimiento: Math.floor(Date.now() / 1000),
      dt_procesado: Math.floor(Date.now() / 1000),
      json_metadata: depositoData.metadata
    };
    
    const insertMovimientoQuery = `
      INSERT INTO movimientos_cuenta (
        id_cuenta, id_promotor, tipo_movimiento, dc_monto, dc_saldo_anterior, 
        dc_saldo_nuevo, vc_concepto, vc_referencia, id_usuario_autorizo, 
        en_estado, dt_movimiento, dt_procesado, json_metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [movimientoResult] = await connection.query<ResultSetHeader>(insertMovimientoQuery, [
      movimiento.id_cuenta,
      movimiento.id_promotor,
      movimiento.tipo_movimiento,
      movimiento.dc_monto,
      movimiento.dc_saldo_anterior,
      movimiento.dc_saldo_nuevo,
      movimiento.vc_concepto,
      movimiento.vc_referencia,
      movimiento.id_usuario_autorizo,
      movimiento.en_estado,
      movimiento.dt_movimiento,
      movimiento.dt_procesado,
      JSON.stringify(movimiento.json_metadata)
    ]);
    
    // 5. Actualizar saldos de la cuenta
    const updateCuentaQuery = `
      UPDATE cuentas_promotores 
      SET dc_saldo_actual = ?, 
          dc_saldo_disponible = ?, 
          dt_actualizacion = ? 
      WHERE id_cuenta = ?
    `;
    
    await connection.query<ResultSetHeader>(updateCuentaQuery, [
      saldo_nuevo,
      nuevo_saldo_disponible,
      Math.floor(Date.now() / 1000),
      cuenta.id_cuenta
    ]);
    
    await connection.commit();
    
    return {
      movimiento_id: movimientoResult.insertId,
      nuevo_saldo: saldo_nuevo
    };
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al realizar depósito:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Función para realizar retiro
export const realizar_retiro = async (retiroData: RetiroRequest): Promise<{ movimiento_id: number, nuevo_saldo: number }> => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // 1. Obtener cuenta actual
    const cuenta = await get_cuenta_by_promotor(retiroData.id_promotor, connection);
    if (!cuenta) {
      throw new Error('Cuenta no encontrada o inactiva');
    }
    
    // 2. Validar monto
    if (retiroData.monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
    
    // 3. Validar saldo disponible
    if (cuenta.dc_saldo_disponible < retiroData.monto) {
      throw new Error(`Saldo insuficiente. Disponible: ${cuenta.dc_saldo_disponible.toFixed(6)}, Solicitado: ${retiroData.monto.toFixed(6)}`);
    }
    
    // 4. Calcular nuevos saldos
    const saldo_anterior = cuenta.dc_saldo_actual;
    const saldo_nuevo = saldo_anterior - retiroData.monto;
    const nuevo_saldo_disponible = cuenta.dc_saldo_disponible - retiroData.monto;
    
    // 5. Crear movimiento
    const movimiento: movimientos_cuenta = {
      id_cuenta: cuenta.id_cuenta!,
      id_promotor: retiroData.id_promotor,
      tipo_movimiento: 'EGRESO',
      dc_monto: retiroData.monto,
      dc_saldo_anterior: saldo_anterior,
      dc_saldo_nuevo: saldo_nuevo,
      vc_concepto: retiroData.concepto,
      vc_referencia: retiroData.referencia,
      id_usuario_autorizo: retiroData.id_usuario_autorizo,
      en_estado: 'COMPLETADO',
      dt_movimiento: Math.floor(Date.now() / 1000),
      dt_procesado: Math.floor(Date.now() / 1000),
      json_metadata: retiroData.metadata
    };
    
    const insertMovimientoQuery = `
      INSERT INTO movimientos_cuenta (
        id_cuenta, id_promotor, tipo_movimiento, dc_monto, dc_saldo_anterior, 
        dc_saldo_nuevo, vc_concepto, vc_referencia, id_usuario_autorizo, 
        en_estado, dt_movimiento, dt_procesado, json_metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [movimientoResult] = await connection.query<ResultSetHeader>(insertMovimientoQuery, [
      movimiento.id_cuenta,
      movimiento.id_promotor,
      movimiento.tipo_movimiento,
      movimiento.dc_monto,
      movimiento.dc_saldo_anterior,
      movimiento.dc_saldo_nuevo,
      movimiento.vc_concepto,
      movimiento.vc_referencia,
      movimiento.id_usuario_autorizo,
      movimiento.en_estado,
      movimiento.dt_movimiento,
      movimiento.dt_procesado,
      JSON.stringify(movimiento.json_metadata)
    ]);
    
    // 6. Actualizar saldos de la cuenta
    const updateCuentaQuery = `
      UPDATE cuentas_promotores 
      SET dc_saldo_actual = ?, 
          dc_saldo_disponible = ?, 
          dt_actualizacion = ? 
      WHERE id_cuenta = ?
    `;
    
    await connection.query<ResultSetHeader>(updateCuentaQuery, [
      saldo_nuevo,
      nuevo_saldo_disponible,
      Math.floor(Date.now() / 1000),
      cuenta.id_cuenta
    ]);
    
    await connection.commit();
    
    return {
      movimiento_id: movimientoResult.insertId,
      nuevo_saldo: saldo_nuevo
    };
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al realizar retiro:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Función para obtener historial de movimientos
export const get_historial_movimientos = async (
  id_promotor: number, 
  limite: number = 50, 
  offset: number = 0
): Promise<movimientos_cuenta[]> => {
  try {
    const query = `
      SELECT id_movimiento, id_cuenta, id_promotor, tipo_movimiento, dc_monto, 
             dc_saldo_anterior, dc_saldo_nuevo, vc_concepto, vc_referencia, 
             id_usuario_autorizo, en_estado, dt_movimiento, dt_procesado, json_metadata
      FROM movimientos_cuenta 
      WHERE id_promotor = ? 
      ORDER BY dt_movimiento DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.query<RowDataPacket[]>(query, [id_promotor, limite, offset]);
    
    return rows.map(row => ({
      id_movimiento: row.id_movimiento,
      id_cuenta: row.id_cuenta,
      id_promotor: row.id_promotor,
      tipo_movimiento: row.tipo_movimiento,
      dc_monto: parseFloat(row.dc_monto),
      dc_saldo_anterior: parseFloat(row.dc_saldo_anterior),
      dc_saldo_nuevo: parseFloat(row.dc_saldo_nuevo),
      vc_concepto: row.vc_concepto,
      vc_referencia: row.vc_referencia,
      id_usuario_autorizo: row.id_usuario_autorizo,
      en_estado: row.en_estado,
      dt_movimiento: row.dt_movimiento,
      dt_procesado: row.dt_procesado,
      json_metadata: row.json_metadata ? JSON.parse(row.json_metadata) : null
    }));
    
  } catch (error) {
    console.error('Error al obtener historial de movimientos:', error);
    throw error;
  }
}

// Función para obtener saldo actual
export const get_saldo_promotor = async (id_promotor: number): Promise<cuentas_promotores | null> => {
  try {
    return await get_cuenta_by_promotor(id_promotor);
  } catch (error) {
    console.error('Error al obtener saldo del promotor:', error);
    throw error;
  }
}