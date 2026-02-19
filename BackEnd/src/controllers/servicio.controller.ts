import { Request, Response } from 'express';
import { ServicioService } from '../services/servicio.service';

// OBTENER LISTA DE SERVICIOS PUBLICOS
export const obtenerServicios = async (req: Request, res: Response) => {
    try {
        const servicios = await ServicioService.getAllServices();

        res.status(200).json({
            success: true,
            mensaje: 'SERVICIOS OBTENIDOS',
            data: servicios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'ERROR AL OBTENER SERVICIOS'
        });
    }
};