import { Request, Response } from 'express';
import { create_user } from '@/core/usuarios';
import { create_producto, create_pregunta_producto } from '@/core/productos';
import { create_establecimiento } from '@/core/establecimientos';
import { create_ticket, create_ticket_producto } from '@/core/tickets';

export const createUser = async (req: Request, res: Response) => {
    try {
        const {vc_username, vc_password} = req.body;
        if (!vc_username || !vc_password) {
            return res.status(400).json({message: 'Username and password are required'});
        }
        const user = {
            vc_username,
            vc_password
        };
        const userId = await create_user(user);
        return res.status(201).json({
            ok: true,
            data: userId,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {producto, preguntas} = req.body;

        const new_product = await create_producto(producto);

        if (!new_product) {
            return res.status(400).json({message: 'Error creating product'});
        }
        if (preguntas && preguntas.length > 0) {
            const new_preguntas = await create_pregunta_producto(preguntas, new_product);
            if (!new_preguntas) {
                return res.status(400).json({message: 'Error creating product questions'});
            }
        }
        return res.status(201).json({
            ok: true,
            data: new_product,
            message: 'Product created successfully',
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Internal server error'
        });
    }
}

export const createEstablecimineto = async (req: Request, res: Response) => {
    try {
        const {establecimiento} = req.body;
        const new_establecimiento = await create_establecimiento(establecimiento);
        if (!new_establecimiento) {
            return res.status(400).json({message: 'Error creating establishment'});
        }
        return res.status(201).json({
            ok: true,
            data: new_establecimiento,
            message: 'Establecimineto created successfully',
        });
    } catch (error) {
        console.error('Error creating establecimiento:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Internal server error'
        });
    }
}

export const createTicket = async (req: Request, res: Response) => {
    try {
        const {ticket, productos} = req.body;
        const new_ticket = await create_ticket(ticket);
        if (!new_ticket) {
            return res.status(400).json({message: 'Error creating ticket'});
        }
        if (productos && productos.length > 0) {
            const new_productos = await create_ticket_producto(productos, new_ticket);
            if (!new_productos) {
                return res.status(400).json({message: 'Error creating ticket products'});
            }
        }
        return res.status(201).json({
            ok: true,
            data: new_ticket,
            message: 'Ticket created successfully',
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return res.status(500).json({
            ok: false,
            data: null,
            message: 'Internal server error'
        });
    }
}