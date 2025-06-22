import { Request, Response, NextFunction } from "express";
import { verify_token, TokenPayload } from '../../core/utils';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload; // Añadimos la propiedad user al objeto Request
        }
    }
}

/**
 * Middleware para verificar la autenticación mediante JWT
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Obtener el token del header de autorización
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({
          ok: false,
          data: null,
          message: 'Acceso denegado. Token no proporcionado.'
        });
        return;
      }
  
      // Verificar formato del header de autorización
      if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          ok: false,
          data: null,
          message: 'Formato de token inválido. Utilice Bearer {token}'
        });
        return;
      }
  
      // Extraer el token
      const token = authHeader.split(' ')[1];
      
      // Verificar el token
      const decoded = verify_token(token);
      
      if (!decoded) {
        res.status(401).json({
          ok: false,
          data: null,
          message: 'Token inválido o expirado'
        });
        return;
      }
  
      // Agregar información del usuario al request para uso posterior
      req.user = decoded;
      
      // Continuar con la siguiente función
      next();
    } catch (error) {
      console.error('Error en el middleware de autenticación:', error);
      res.status(500).json({
        ok: false,
        data: null,
        message: 'Error interno del servidor'
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