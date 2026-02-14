import { Request, Response, NextFunction } from 'express';
import * as mascotaService from '../services/mascota.service';

// LISTAR MIS MASCOTAS
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('NO AUTORIZADO');
        }

        const mascotas = await mascotaService.misMascotas(req.user.id);

        res.json({ data: mascotas });
    } catch (error) {
        next(error);
    }
};

// REGISTRAR MASCOTA
export const createMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const { nombre, especie, raza, fecha_nacimiento, advertencias } = req.body;

        if (!nombre || !especie) {
            return res.status(400).json({ message: 'NOMBRE Y ESPECIE SON OBLIGATORIOS' });
        }

        const nuevaMascota = await mascotaService.registrarMascota(req.user.id, {
            nombre, especie, raza, fecha_nacimiento, advertencias
        });

        res.status(201).json({ message: 'MASCOTA REGISTRADA EXITOSAMENTE', data: nuevaMascota });
    } catch (error) {
        next(error);
    }
};

// OBTENER UNA MASCOTA
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new Error('ID INVALIDO');

        const mascota = await mascotaService.obtenerMascota(id);
        if (!mascota) return res.status(404).json({ message: 'Mascota no encontrada' });

        res.json({ data: mascota });
    } catch (error) {
        next(error);
    }
};

// ELIMINAR MASCOTA
export const deleteMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const id = Number(req.params.id);
        if (isNaN(id)) throw new Error('ID INVALIDO');

        await mascotaService.eliminarMascota(id, req.user.id, req.user.rol);

        res.json({ message: 'MASCOTA ELIMINADA EXITOSAMENTE' });
    } catch (error: any) {
        if (error.message.includes('No tienes permiso')) {
            return res.status(403).json({ message: error.message });
        }
        next(error);
    }
};

// ACTUALIZAR MASCOTA
export const updateMascota = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const id = Number(req.params.id);
        if (isNaN(id)) throw new Error('ID INVALIDO');

        await mascotaService.actualizarMascota(id, req.user.id, req.body);

        res.json({ message: 'MASCOTA ACTUALIZADA EXITOSAMENTE' });
    } catch (error: any) {
        if (error.message.includes('No tienes permiso')) {
            return res.status(403).json({ message: error.message });
        }
        next(error);
    }
};