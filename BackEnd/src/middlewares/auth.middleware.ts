import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/auth.types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'ACCESO DENEGADO: Falta el token',
                error_code: 'MISSING_TOKEN'
            });
        }

        const token = authHeader.replace('Bearer ', '').trim();
        const secret = process.env.JWT_SECRET || 'UTN_PATITAS_2024';

        const decoded = jwt.verify(token, secret) as UserPayload;

        req.user = decoded;
        next();

    } catch (error: unknown) {
        // ERROR DE AUTH MANEJADO SILENCIOSAMENTE EN PRODUCCION
        return res.status(403).json({
            success: false,
            message: 'TOKEN INVALIDO O EXPIRADO',
            error_code: 'INVALID_TOKEN'
        });
    }
};