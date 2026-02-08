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
        // VERIFICACION DE AUTENTICACION
        if (!req.user) {
            throw new Error('No autorizado');
        }

        // LLAMADA AL SERVICIO
        const perfil = await duenoService.obtenerPerfil(req.user.id);

        if (!perfil) {
            res.status(404).json({ message: 'Perfil no encontrado' });
            return; 
        }

        res.json({ data: perfil });
    } catch (error) {
        next(error);
    }
};