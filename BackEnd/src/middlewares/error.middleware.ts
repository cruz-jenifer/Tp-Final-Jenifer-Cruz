import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', error.message || error);

  // RECURSO DUPLICADO
  if (error.message === 'EL USUARIO YA EXISTE' || error.message?.includes('Duplicate entry')) {
    return res.status(409).json({ message: 'EL USUARIO O RECURSO YA EXISTE' });
  }

  // ERRORES DE AUTENTICACION
  if (error.message === 'CREDENCIALES INVALIDAS' || error.message === 'NO AUTORIZADO') {
    return res.status(401).json({ message: 'ACCESO DENEGADO' });
  }

  // TOKEN EXPIRADO
  if (error.message?.includes('jwt expired')) {
    return res.status(403).json({ message: 'SESION EXPIRADA' });
  }



  // ERROR INTERNO
  return res.status(500).json({
    message: 'ERROR INTERNO DEL SERVIDOR',
    ...(process.env.NODE_ENV === 'development' && {
      error: error.message,
      stack: error.stack
    })
  });
};