import { Request, Response, NextFunction } from 'express';
import * as duenoService from '../services/dueno.service';

// CREAR DUENO
export const createPerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // VERIFICAR AUTENTICACION
        if (!req.user) {
            throw new Error('NO AUTORIZADO');
        }

        const { nombre, apellido, telefono } = req.body;

        // VALIDAR DATOS
        if (!nombre || !apellido || !telefono) {
            res.status(400).json({ message: 'FALTAN DATOS REQUERIDOS' });
            return;
        }

        // CREAR PERFIL
        const nuevoDueno = await duenoService.registrarPerfil(req.user.id, { nombre, apellido, telefono });

        res.status(201).json({ message: 'PERFIL CREADO EXITOSAMENTE', data: nuevoDueno });
    } catch (error) {
        next(error);
    }
};

// OBTENER MI PERFIL
export const getMiPerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

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
        if (!req.user) throw new Error('NO AUTORIZADO');

        const datos = req.body;
        const perfilActualizado = await duenoService.actualizarPerfil(req.user.id, datos);

        res.json({ message: 'PERFIL ACTUALIZADO', data: perfilActualizado });
    } catch (error) {
        next(error);
    }
};

// ELIMINAR DUENO
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

// OBTENER TODOS LOS DUENOS
export const getAllDuenos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const duenos = await duenoService.obtenerTodos();
        res.json({ data: duenos });
    } catch (error) {
        next(error);
    }
};

// CREAR DUENO DESDE ADMIN
export const createDuenoAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre, apellido, email, telefono, dni } = req.body;

        if (!nombre || !apellido || !email || !telefono) {
            res.status(400).json({ message: 'FALTAN DATOS REQUERIDOS' });
            return;
        }

        const nuevoDueno = await duenoService.registrarNuevoDuenoAdmin({ nombre, apellido, email, telefono, dni });

        res.status(201).json({ message: 'DUENO CREADO EXITOSAMENTE', data: nuevoDueno });
    } catch (error) {
        next(error);
    }
};