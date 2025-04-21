import {Request, Response} from 'express'
import {create_promotor, verify_promotor} from '@/core/promotor'
import {generate_token} from '@/core/utils'

export const crear_promotor = async (req: Request, res: Response) => {
    try {
        const {vc_username, vc_password} = req.body;
        if (!vc_username || !vc_password) {
            return res.status(400).json({message: 'Username and password are required'});
        }
        const promotorId = await create_promotor(req.body);
        return res.status(201).json({
            ok: true,
            data: promotorId,
            message: 'Promotor created successfully',
        });
    } catch (error) {
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
                message: 'Username and password are required' 
            });
        }
        
        const promotor = await verify_promotor(vc_username, vc_password);
        
        if (!promotor) {
            return res.status(401).json({ 
                ok: false,
                message: 'Invalid credentials' 
            });
        }
        
        // Aquí podrías generar un token JWT si quieres implementar autenticación con tokens

        const token = generate_token({
            id: promotor.id_promotor!,
            vc_username: promotor.vc_username
        });
        
        return res.status(201).json({
            ok: true,
            data: {
                access_token: token,
                user: promotor
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Error during promotor login:', error);
        return res.status(500).json({ 
            ok: false,
            message: 'Internal server error' 
        });
    }
};