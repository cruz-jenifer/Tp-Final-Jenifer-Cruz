import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../types/api.types';
import { LoginApiResponse } from '../types/auth.types';

// REGISTRO
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.register(req.body);

        const response: ApiResponse = {
            success: true,
            message: 'USUARIO REGISTRADO EXITOSAMENTE',
            data: user
        };
        res.status(201).json(response);
    } catch (error: unknown) {
        next(error);
    }
};

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });

        const response: LoginApiResponse = {
            success: true,
            message: 'LOGIN EXITOSO',
            data: result
        };

        res.json(response);
    } catch (error: unknown) {
        next(error);
    }
};