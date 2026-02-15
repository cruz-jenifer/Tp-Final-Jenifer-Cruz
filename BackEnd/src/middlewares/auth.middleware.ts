import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/auth.types'; 

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'ACCESO DENEGADO: Falta el token' });
        }

        const token = authHeader.replace('Bearer ', '').trim();
        const secret = 'UTN_PATITAS_2024'; 

        
        const decoded = jwt.verify(token, secret) as UserPayload;
        
        req.user = decoded;
        next();

    } catch (error) {
        console.log('ERROR DE AUTH:', error); 
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};