import { Request, Response } from 'express';
import { ServicioService } from '../services/servicio.service';

// OBTENER LISTA DE SERVICIOS PUBLICOS
export const getServicios = async (req: Request, res: Response) => {
    try {
        const servicios = await ServicioService.getAllServices();
        
        res.status(200).json({
            success: true,
            data: servicios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener servicios'
        });
    }
};