import { Request, Response } from 'express';
import { create_user } from '@/core/usuarios';

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