import { Request, Response, NextFunction } from 'express';
import { HistorialService } from '../services/historial.service';
import * as DuenoModel from '../models/dueno.model';
import { RolNombre } from '../types/enums';

// CREAR REGISTRO DE HISTORIAL
export const crearHistorial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const resultado = await HistorialService.crearRegistro(req.user.id, req.user.rol, req.body);

        res.status(201).json({ success: true, mensaje: 'HISTORIAL ACTUALIZADO', data: resultado });

    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('ACCESO DENEGADO')) {
            return res.status(403).json({ success: false, mensaje: error.message });
        }
        next(error);
    }
};

// OBTENER HISTORIAL POR MASCOTA
export const obtenerHistorialPorMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { id } = req.params;
        const mascotaId = Number(id);

        // VALIDACION DE PROPIEDAD
        if (req.user.rol === RolNombre.CLIENTE) {
            const dueno = await DuenoModel.findByUserId(req.user.id);
            if (!dueno) {
                return res.status(403).json({ success: false, mensaje: 'NO TIENES PERFIL DE DUEÑO' });
            }
        }

        const historial = await HistorialService.obtenerPorMascota(mascotaId, req.user.id, req.user.rol);
        res.json({ success: true, mensaje: 'HISTORIAL OBTENIDO', data: historial });
    } catch (error: unknown) {
        next(error);
    }
};

// OBTENER TODOS LOS HISTORIALES (ADMIN)
export const obtenerTodosLosHistoriales = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const historiales = await HistorialService.obtenerTodos();
        res.json({ success: true, mensaje: 'HISTORIALES OBTENIDOS', data: historiales });
    } catch (error: unknown) {
        next(error);
    }
};

// ELIMINAR REGISTRO DE HISTORIAL
export const eliminarHistorial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');
        const { id } = req.params;

        await HistorialService.eliminarRegistro(Number(id), req.user.id, req.user.rol);

        res.json({ success: true, mensaje: 'HISTORIAL ELIMINADO', data: null });

    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('PERMISO')) {
            return res.status(403).json({ success: false, mensaje: error.message });
        }
        next(error);
    }
};

// ACTUALIZAR REGISTRO DE HISTORIAL
export const actualizarHistorial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');
        const { id } = req.params;

        await HistorialService.actualizarRegistro(Number(id), req.user.id, req.user.rol, req.body);

        res.json({ success: true, mensaje: 'HISTORIAL ACTUALIZADO', data: null });

    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('PERMISO')) {
            return res.status(403).json({ success: false, mensaje: error.message });
        }
        next(error);
    }
};
