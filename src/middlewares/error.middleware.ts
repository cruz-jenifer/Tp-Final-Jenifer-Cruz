import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  
  if (error.message === 'El usuario ya existe') {
    return res.status(409).json({ message: error.message });
  }
  
  if (error.message === 'Credenciales inválidas') {
    return res.status(401).json({ message: error.message });
  }
  
  res.status(500).json({ message: 'Error interno del servidor' });
};