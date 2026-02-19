import { Request, Response, NextFunction } from 'express';
import { MascotaService } from '../services/mascota.service';
import * as MascotaModel from '../models/mascota.model';

export class MascotaController {

    // LISTAR MASCOTAS PROPIAS
    static async listarMisMascotas(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioId = req.user?.id;
            if (!usuarioId) throw new Error('USUARIO NO IDENTIFICADO');

            const mascotas = await MascotaService.listarPropias(usuarioId);
            res.json({ success: true, mensaje: 'MASCOTAS OBTENIDAS', data: mascotas });
        } catch (error: unknown) {
            next(error);
        }
    }

    // OBTENER POR ID
    static async obtenerMascotaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const mascota = await MascotaModel.buscarPorId(Number(id));

            if (!mascota) {
                return res.status(404).json({ success: false, mensaje: 'MASCOTA NO ENCONTRADA' });
            }

            res.json({ success: true, mensaje: 'MASCOTA OBTENIDA', data: mascota });
        } catch (error: unknown) {
            next(error);
        }
    }

    // OBTENER TODAS
    static async obtenerTodasLasMascotas(req: Request, res: Response, next: NextFunction) {
        try {
            const mascotas = await MascotaService.obtenerTodas();
            res.json({ success: true, mensaje: 'MASCOTAS OBTENIDAS', data: mascotas });
        } catch (error: unknown) {
            next(error);
        }
    }

    // ELIMINAR MASCOTA
    static async eliminarMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const usuarioId = req.user?.id;
            const rol = req.user?.rol;

            if (!usuarioId || !rol) throw new Error('USUARIO NO IDENTIFICADO');

            await MascotaService.eliminarConValidacion(Number(id), usuarioId, rol);

            res.json({ success: true, mensaje: 'MASCOTA ELIMINADA CORRECTAMENTE', data: null });

        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes('ACCESO DENEGADO')) {
                return res.status(403).json({ success: false, mensaje: error.message });
            }
            next(error);
        }
    }

    // CREAR MASCOTA
    static async crearMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioId = req.user?.id;
            const rol = req.user?.rol;

            if (!usuarioId || !rol) throw new Error('USUARIO NO IDENTIFICADO');

            const nuevaMascota = await MascotaService.registrarMascota(usuarioId, req.body, rol);

            res.status(201).json({ success: true, mensaje: 'MASCOTA CREADA', data: nuevaMascota });
        } catch (error: unknown) {
            next(error);
        }
    }

    // ACTUALIZAR MASCOTA
    static async actualizarMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const usuarioId = req.user?.id;
            const rol = req.user?.rol;

            if (!usuarioId || !rol) throw new Error('USUARIO NO IDENTIFICADO');

            await MascotaService.actualizarMascota(Number(id), usuarioId, { ...req.body, rol });

            res.json({ success: true, mensaje: 'MASCOTA ACTUALIZADA CORRECTAMENTE', data: null });
        } catch (error: unknown) {
            if (error instanceof Error && error.message.includes('ACCESO DENEGADO')) {
                return res.status(403).json({ success: false, mensaje: error.message });
            }
            next(error);
        }
    }
}
