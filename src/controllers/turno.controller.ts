import { Request, Response, NextFunction } from 'express';
import { TurnoService } from '../services/turno.service';

export class TurnoController {

    // METODO: LISTAR MIS TURNOS
 // DEBE LLAMARSE IGUAL QUE EN LAS RUTAS
    static async listarMisTurnos(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Usuario no identificado');

            const turnos = await TurnoService.obtenerMisTurnos(userId);
            
            res.json({ data: turnos });
        } catch (error) {
            next(error);
        }
    }

    // METODO: RESERVAR
    
    static async reservar(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Usuario no identificado');

            // DELEGAMOS AL SERVICIO
            const nuevoTurno = await TurnoService.reservarTurno(userId, req.body);

            res.status(201).json({ 
                message: 'TURNO RESERVADO CON ÉXITO', 
                data: nuevoTurno 
            });
        } catch (error: any) {
            // MANEJO DE ERRORES CONOCIDOS
            if (error.message.includes('ocupado')) {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes('dueño')) {
                return res.status(403).json({ message: error.message });
            }
            next(error);
        }
    }
}