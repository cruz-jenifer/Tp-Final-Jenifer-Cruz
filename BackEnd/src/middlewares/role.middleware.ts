import { Request, Response, NextFunction } from 'express';

// MIDDLEWARE PARA VERIFICAR ROLES
export const checkRole = (rolesPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        // VERIFICAR EXISTENCIA DE USUARIO
      
        if (!req.user) {
            return res.status(401).json({ message: 'ACCESO DENEGADO: USUARIO NO IDENTIFICADO' });
        }

        // VERIFICAR PERMISOS
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ 
                message: 'NO TIENES PERMISOS PARA REALIZAR ESTA ACCION' 
            });
        }

        next();
    };
};