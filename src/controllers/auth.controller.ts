import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userId = await authService.register(email, password);
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      userId 
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.status(200).json({ 
      message: 'Autenticación exitosa', 
      token 
    });
  } catch (error) {
    next(error);
  }
};