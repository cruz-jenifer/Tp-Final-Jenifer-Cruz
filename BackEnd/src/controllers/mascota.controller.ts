
import { Request, Response, NextFunction } from 'express';
import * as MascotaModel from '../models/mascota.model';
import * as DuenoModel from '../models/dueno.model';
import * as MascotaService from '../services/mascota.service';

export class MascotaController {

    // LISTAR MASCOTAS
    static async listarMisMascotas(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const dueno = await DuenoModel.findByUserId(userId);
            if (!dueno) {
                // SIN PERFIL DE DUENO
                return res.json({ data: [] });
            }

            const mascotas = await MascotaModel.findByDuenoId(dueno.id);
            res.json({ data: mascotas });
        } catch (error) {
            next(error);
        }
    }

    // OBTENER MASCOTA POR ID
    static async getMascotaById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const mascota = await MascotaModel.findById(Number(id));

            if (!mascota) {
                return res.status(404).json({ message: 'MASCOTA NO ENCONTRADA' });
            }



            res.json(mascota);
        } catch (error) {
            next(error);
        }
    }

    // OBTENER TODAS LAS MASCOTAS
    static async getAllMascotas(req: Request, res: Response, next: NextFunction) {
        try {
            const mascotas = await MascotaService.obtenerTodas();
            res.json({ data: mascotas });
        } catch (error) {
            next(error);
        }
    }

    // ELIMINAR MASCOTA
    static async eliminarMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            // VALIDAR PROPIEDAD
            const mascota = await MascotaModel.findById(Number(id));
            if (!mascota) return res.status(404).json({ message: 'MASCOTA NO ENCONTRADA' });

            const dueno = await DuenoModel.findByUserId(userId!);

            // VERIFICAR PERTENENCIA
            if (req.user?.rol === 'cliente') {
                if (!dueno || mascota.dueno_id !== dueno.id) {
                    return res.status(403).json({ message: 'NO TIENE PERMISO PARA ELIMINAR ESTA MASCOTA' });
                }
            }

            await MascotaModel.deleteById(Number(id));
            res.json({ message: 'MASCOTA ELIMINADA CORRECTAMENTE' });

        } catch (error) {
            next(error);
        }
    }

    // CREAR MASCOTA
    static async crearMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const role = req.user?.rol;

            if (!userId) throw new Error('USUARIO NO IDENTIFICADO');

            const nuevaMascota = await MascotaService.registrarMascota(userId, req.body, role!);

            res.status(201).json({ message: 'MASCOTA CREADA', data: nuevaMascota });
        } catch (error) {
            next(error);
        }
    }

    // ACTUALIZAR MASCOTA
    static async actualizarMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const role = req.user?.rol;

            await MascotaService.actualizarMascota(Number(id), userId!, { ...req.body, rol: role });

            res.json({ message: 'MASCOTA ACTUALIZADA CORRECTAMENTE' });
        } catch (error) {
            next(error);
        }
    }
}