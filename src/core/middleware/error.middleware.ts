import { Request, Response, NextFunction } from "express";
import { logger } from "../services/logger.service";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para capturar errores HTTP (respuestas con código >= 400)
export const responseLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown) {
    // Log si el status code es un error (>= 400)
    if (res.statusCode >= 400) {
      logger.httpError(
        res.statusCode,
        typeof body === "object" && body !== null && "error" in body
          ? String((body as { error: unknown }).error)
          : "HTTP Error Response",
        {
          method: req.method,
          originalUrl: req.originalUrl,
          ip: req.ip || req.socket?.remoteAddress,
          user: (req as Request & { user?: { id: string | number } }).user,
        },
        typeof body === "object" && body !== null && "details" in body
          ? (body as { details: unknown }).details
          : undefined
      );
    }

    return originalJson(body);
  };

  next();
};

// Middleware global de manejo de errores (debe ir al final de todos los middlewares)
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  // Log del error
  logger.httpError(
    statusCode,
    message,
    {
      method: req.method,
      originalUrl: req.originalUrl,
      ip: req.ip || req.socket?.remoteAddress,
      user: (req as Request & { user?: { id: string | number } }).user,
    },
    err
  );

  // Respuesta al cliente
  res.status(statusCode).json({
    ok: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};

// Middleware para rutas no encontradas
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.httpError(
    404,
    `Route not found: ${req.method} ${req.originalUrl}`,
    {
      method: req.method,
      originalUrl: req.originalUrl,
      ip: req.ip || req.socket?.remoteAddress,
    }
  );

  res.status(404).json({
    ok: false,
    error: "Route not found",
  });
};
