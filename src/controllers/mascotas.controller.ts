import { Request, Response, NextFunction } from 'express';

// Ejemplo básico - puedes expandir esto
export const getMascotas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'Lista de mascotas' });
  } catch (error) {
    next(error);
  }
};