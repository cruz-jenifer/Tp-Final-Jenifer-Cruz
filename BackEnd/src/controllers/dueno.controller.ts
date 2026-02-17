import { Request, Response, NextFunction } from 'express';
import * as duenoService from '../services/dueno.service';

// CREAR PERFIL DE DUENO
export const createPerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // VERIFICACION DE AUTENTICACION
        if (!req.user) {
            throw new Error('No autorizado');
        }

        const { nombre, apellido, telefono } = req.body;

        // VALIDACION DE DATOS OBLIGATORIOS
        if (!nombre || !apellido || !telefono) {
            res.status(400).json({ message: 'Faltan datos requeridos' });
            return;
        }

        // LLAMADA AL SERVICIO
        const nuevoDueno = await duenoService.registrarPerfil(req.user.id, { nombre, apellido, telefono });

        res.status(201).json({ message: 'Perfil creado exitosamente', data: nuevoDueno });
    } catch (error) {
        next(error);
    }
};

// OBTENER MI PERFIL
export const getMiPerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('No autorizado');

        const perfil = await duenoService.obtenerPerfil(req.user.id);

        if (!perfil) {
            return res.status(404).json({ message: 'PERFIL NO ENCONTRADO' });
        }

        res.json({ data: perfil });
    } catch (error) {
        next(error);
    }
};

// ACTUALIZAR MI PERFIL
export const updatePerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('No autorizado');

        const datos = req.body;
        const perfilActualizado = await duenoService.actualizarPerfil(req.user.id, datos);

        res.json({ message: 'PERFIL ACTUALIZADO', data: perfilActualizado });
    } catch (error) {
        next(error);
    }
};

// ELIMINAR DUENO (ADMIN)
export const deleteDueno = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new Error('ID INVALIDO');

        await duenoService.eliminarDueno(id);

        res.json({ message: 'DUENO ELIMINADO EXITOSAMENTE' });
    } catch (error) {
        next(error);
    }
};

// OBTENER TODOS LOS DUENOS (ADMIN)
export const getAllDuenos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const duenos = await duenoService.obtenerTodos();
        res.json({ data: duenos });
    } catch (error) {
        next(error);
    }
};