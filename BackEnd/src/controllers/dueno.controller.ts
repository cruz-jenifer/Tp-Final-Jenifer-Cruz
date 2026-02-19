import { Request, Response, NextFunction } from 'express';
import * as duenoService from '../services/dueno.service';

// CREAR PERFIL DE DUEÑO
export const crearPerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('NO AUTORIZADO');
        }

        const { telefono, dni } = req.body;

        if (!telefono) {
            return res.status(400).json({ success: false, mensaje: 'FALTAN DATOS REQUERIDOS' });
        }

        const nuevoDueno = await duenoService.registrarPerfil(req.user.id, { telefono, dni });

        res.status(201).json({ success: true, mensaje: 'PERFIL CREADO EXITOSAMENTE', data: nuevoDueno });
    } catch (error) {
        next(error);
    }
};

// OBTENER MI PERFIL
export const obtenerMiPerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const perfil = await duenoService.obtenerPerfil(req.user.id);

        if (!perfil) {
            return res.status(404).json({ success: false, mensaje: 'PERFIL NO ENCONTRADO' });
        }

        res.json({ success: true, mensaje: 'PERFIL OBTENIDO', data: perfil });
    } catch (error) {
        next(error);
    }
};

// ACTUALIZAR MI PERFIL
export const actualizarPerfil = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) throw new Error('NO AUTORIZADO');

        const datos = req.body;
        const perfilActualizado = await duenoService.actualizarPerfil(req.user.id, datos);

        res.json({ success: true, mensaje: 'PERFIL ACTUALIZADO', data: perfilActualizado });
    } catch (error) {
        next(error);
    }
};

// ELIMINAR DUEÑO
export const eliminarDueno = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new Error('ID INVALIDO');

        await duenoService.eliminarDueno(id);

        res.json({ success: true, mensaje: 'DUEÑO ELIMINADO EXITOSAMENTE', data: null });
    } catch (error) {
        next(error);
    }
};

// OBTENER TODOS LOS DUEÑOS
export const obtenerTodosLosDuenos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const duenos = await duenoService.obtenerTodos();
        res.json({ success: true, mensaje: 'DUEÑOS OBTENIDOS', data: duenos });
    } catch (error) {
        next(error);
    }
};

// CREAR DUEÑO DESDE ADMIN
export const crearDuenoAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nombre, apellido, email, telefono, dni } = req.body;

        if (!nombre || !apellido || !email || !telefono) {
            return res.status(400).json({
                success: false,
                mensaje: 'FALTAN DATOS OBLIGATORIOS: nombre, apellido, email y telefono son requeridos'
            });
        }

        const nuevo_dueno = await duenoService.registrarNuevoDuenoAdmin({ nombre, apellido, email, telefono, dni });

        res.status(201).json({
            success: true,
            mensaje: 'DUEÑO CREADO EXITOSAMENTE. CLAVE TEMPORAL GENERADA.',
            data: nuevo_dueno
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message?.includes('EMAIL')) {
                return res.status(409).json({ success: false, mensaje: 'EL EMAIL INGRESADO YA ESTA REGISTRADO EN EL SISTEMA' });
            }
            if (error.message?.includes('ROL')) {
                return res.status(500).json({ success: false, mensaje: 'ERROR DE CONFIGURACION: EL ROL DE CLIENTE NO EXISTE EN LA BASE DE DATOS' });
            }
        }
        next(error);
    }
};