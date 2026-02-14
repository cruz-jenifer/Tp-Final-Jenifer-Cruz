import { Request, Response, NextFunction } from 'express';
import { PagoService } from '../services/pago.service';
import { IPago } from '../models/pago.model';

export class PagoController {

    // REGISTRAR PAGO
    static async registrarPago(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const { turno_id, monto, metodo } = req.body;

            // VALIDAR DATOS
            if (!turno_id || !monto || !metodo) {
                return res.status(400).json({ message: 'FALTAN DATOS DE PAGO (turno_id, monto, metodo)' });
            }

            const pagoData: IPago = {
                turno_id,
                monto,
                metodo,
                estado: 'pendiente' // CAMBIO POR SERVICIO
            };

            const resultado = await PagoService.procesarPago(pagoData, userId);

            res.status(201).json({
                success: true,
                data: resultado
            });

        } catch (error: any) {
            // MANEJAR ERROR
            if (error.message.includes('no existe') || error.message.includes('permiso')) {
                return res.status(403).json({ message: error.message });
            }
            if (error.message.includes('pendiente')) {
                return res.status(409).json({ message: error.message });
            }
            next(error);
        }
    }

    // VER PAGOS
    static async misPagos(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const pagos = await PagoService.obtenerMisPagos(userId);

            res.json({ data: pagos });
        } catch (error) {
            next(error);
        }
    }
}
