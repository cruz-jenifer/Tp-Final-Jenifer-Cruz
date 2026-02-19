import { Request, Response, NextFunction } from 'express';
import { RazaModel } from '../models/raza.model';

export class RazaController {
    // OBTENER TODAS LAS RAZAS
    static async obtenerTodas(req: Request, res: Response, next: NextFunction) {
        try {
            const razas = await RazaModel.buscarTodos();
            res.json({ success: true, data: razas });
        } catch (error) {
            next(error);
        }
    }
}
