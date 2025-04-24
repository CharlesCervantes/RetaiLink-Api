import pool from '@/config/database';
import { ResultSetHeader } from 'mysql2';

export interface Ticket {
    id_ticket?: number
    id_establecimineto: number
    id_usuario: number
    id_promotor: number 
}

export interface TicketProductos{
    id_ticket_producto?: number
    id_ticket: number
    id_producto: number
    vc_respuesta?: string
    vc_evidencia?: boolean
}

export const create_ticket = async (ticket: Ticket): Promise<number> => {
    try {
        const { id_establecimineto, id_usuario, id_promotor } = ticket;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO tickets (id_establecimineto, id_usuario, id_promotor) VALUES (?, ?, ?)',
            [id_establecimineto, id_usuario, id_promotor]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear ticket:', error);
        throw error;
    }
}
export const create_ticket_producto = async (ticket_producto: TicketProductos, id_ticket: number): Promise<number> => {
    try {
        const { id_producto, vc_respuesta, vc_evidencia } = ticket_producto;
        if (!id_ticket) throw new Error('No hay ticket para insertar el producto');
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO ticket_productos (id_ticket, id_producto, vc_respuesta, vc_evidencia) VALUES (?, ?, ?, ?)',
            [id_ticket, id_producto, vc_respuesta, vc_evidencia]
        );
        
        return result.insertId;
    } catch (error) {
        console.error('Error al crear ticket producto:', error);
        throw error;
    }
}