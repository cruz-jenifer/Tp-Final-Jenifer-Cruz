
import { Request, Response, NextFunction } from 'express';
import * as MascotaModel from '../models/mascota.model';
import * as DuenoModel from '../models/dueno.model';

export class MascotaController {

    // LISTAR MIS MASCOTAS (CLIENTE)
    static async listarMisMascotas(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Usuario no identificado');

            const dueno = await DuenoModel.findByUserId(userId);
            if (!dueno) {
                // Si no es dueño, retornar array vacío o error según lógica negocio
                // Para evitar errores en frontend, mejor array vacío si es un usuario válido pero sin perfil
                return res.json({ data: [] });
            }

            const mascotas = await MascotaModel.findByDuenoId(dueno.id);
            res.json({ data: mascotas });
        } catch (error) {
            next(error);
        }
    }

    // OBTENER MASCOTA POR ID (DETALLE)
    static async getMascotaById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const mascota = await MascotaModel.findById(Number(id));

            if (!mascota) {
                return res.status(404).json({ message: 'Mascota no encontrada' });
            }

            // Opcional: Validar que la mascota pertenezca al usuario que la pide (si es cliente)
            // O si es veterinario puede ver cualquiera.
            // Por simplicidad ahora devolvemos la mascota.

            res.json(mascota);
        } catch (error) {
            next(error);
        }
    }

    // ELIMINAR MASCOTA
    static async eliminarMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            // Validacion basica de propiedad
            const mascota = await MascotaModel.findById(Number(id));
            if (!mascota) return res.status(404).json({ message: 'Mascota no encontrada' });

            const dueno = await DuenoModel.findByUserId(userId!);

            // Si es cliente, verificar que sea su mascota
            if (req.user?.rol === 'cliente') {
                if (!dueno || mascota.dueno_id !== dueno.id) {
                    return res.status(403).json({ message: 'No tienes permiso para eliminar esta mascota' });
                }
            }

            await MascotaModel.deleteById(Number(id));
            res.json({ message: 'Mascota eliminada correctamente' });

        } catch (error) {
            next(error);
        }
    }

    // CREAR MASCOTA (SI SE NECESITARA)
    static async crearMascota(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const dueno = await DuenoModel.findByUserId(userId!);

            if (!dueno) throw new Error('Perfil de dueño no encontrado');

            const nuevaMascota = await MascotaModel.create({
                ...req.body,
                dueno_id: dueno.id
            });

            res.status(201).json({ message: 'Mascota creada', data: nuevaMascota });
        } catch (error) {
            next(error);
        }
    }
}