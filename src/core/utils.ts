import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura';
export interface TokenPayload {
    id: number;
    vc_username: string;
}

export const hash_password = async (password_unsecured: string): Promise<string> => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password_unsecured, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error al hashear la contraseña:', error);
        throw error;
    }
}

export const compare_password = async (password_unsecured: string, password_hashed: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(password_unsecured, password_hashed);
        return isMatch;
    } catch (error) {
        console.error('Error al comparar contraseñas:', error);
        throw error;
    }
}

export const generate_token = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '24h' // El token expira en 24 horas
    });
};

// Función para verificar token JWT
export const verify_token = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        console.error('Error al verificar token:', error);
        return null;
    }
};

export function generarCodigoAfiliacion(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}