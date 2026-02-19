import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/auth.types';

// MIDDLEWARE PARA VERIFICAR LA IDENTIDAD DEL USUARIO
export const autenticar = (req: Request, res: Response, next: NextFunction) => {
    try {
        const cabeceraAutorizacion = req.headers.authorization;

        if (!cabeceraAutorizacion) {
            return res.status(401).json({
                exito: false,
                mensaje: 'ACCESO DENEGADO: TOKEN NO ENCONTRADO'
            });
        }

        const token = cabeceraAutorizacion.replace('Bearer ', '').trim();
        const secreto = process.env.JWT_SECRET || 'UTN_PATITAS_SECRET_KEY';

        const decodificado = jwt.verify(token, secreto) as UserPayload;

        req.user = decodificado;
        next();

    } catch (error: unknown) {
        return res.status(403).json({
            exito: false,
            mensaje: 'TOKEN INVALIDO O EXPIRADO'
        });
    }
};

// MIDDLEWARE PARA VERIFICAR PERMISOS POR ROL
export const autorizar = (rolesPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) {
            return res.status(401).json({
                exito: false,
                mensaje: 'ACCESO DENEGADO: USUARIO NO IDENTIFICADO'
            });
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({
                exito: false,
                mensaje: 'SIN PERMISOS: ACCESO RESTRINGIDO'
            });
        }

        next();
    };
};