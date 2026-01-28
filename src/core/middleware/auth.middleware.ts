import { Request, Response, NextFunction } from "express";
import { Utils, TokenPayload } from '../../core/utils';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/**
 * Middleware para verificar la autenticación mediante JWT
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          ok: false,
          data: null,
          message: 'Acceso denegado. Token no proporcionado.'
        });
        return;
      }

      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          ok: false,
          data: null,
          message: 'Formato de token inválido. Utilice Bearer {token}'
        });
        return;
      }

      const token = authHeader.split(' ')[1];

      const decoded = await Utils.verify_token(token);

      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        ok: false,
        data: null,
        message: 'Token inválido o expirado'
      });
    }
  };

/**
 * Middleware para verificar roles de usuario
 * @param allowedRoles Array de roles permitidos
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return res.status(401).json({
          ok: false,
          data: null,
          message: 'Usuario no autenticado'
        });
      }

      // Verificar si el rol del usuario está permitido
      // Nota: Debes agregar el campo 'role' a tu TokenPayload si quieres usar esta función
      const userRole = (req.user as any).role;
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          ok: false,
          data: null,
          message: 'Acceso denegado. No tienes los permisos necesarios'
        });
      }

      // Si el rol está permitido, continuar
      next();
    } catch (error) {
      console.error('Error en el middleware de roles:', error);
      return res.status(500).json({
        ok: false,
        data: null,
        message: 'Error interno del servidor'
      });
    }
  };
};