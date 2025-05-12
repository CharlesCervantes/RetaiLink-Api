import { Request, Response } from 'express';
import { create_user } from '@/core/usuarios';
import { create_producto } from '@/core/productos';
import { 
    create_establecimiento, 
    get_establecimiento, 
    get_all_establecimientos, 
    update_establecimiento, 
    delete_establecimiento, 
    hard_delete_establecimiento,
    search_establecimientos
} from '@/core/establecimientos';
import { create_ticket, create_ticket_producto } from '@/core/tickets';

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
        const { producto } = req.body;

        const new_product = await create_producto(producto);

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