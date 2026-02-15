import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

// REGISTRO DE USUARIO
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ message: 'Usuario registrado', data: user });
    } catch (error) {
        next(error);
    }
};

// LOGIN DE USUARIO
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.json(result);
    } catch (error) {
        next(error);
    }
};