
import { api } from '../config/api';
import type { HistorialPayload, HistorialUpdatePayload, AgendaItem, HistorialDetalle } from '../types/historial.types';
import type { Mascota } from '../types/mascota.types';

interface RespuestaAgenda {
    fecha: string;
    total_turnos: number;
    turnos: AgendaItem[];
}

// SERVICIO PARA OPERACIONES DEL VETERINARIO EN ESPAÑOL
export const servicioVet = {
    // OBTENER AGENDA DEL DIA
    obtenerAgenda: async (fecha: string): Promise<RespuestaAgenda> => {
        return api.get<RespuestaAgenda>(`/veterinarios/agenda?fecha=${fecha}`);
    },

    // OBTENER HISTORIAL RECIENTE
    obtenerHistorialReciente: async (): Promise<HistorialDetalle[]> => {
        return api.get<HistorialDetalle[]>('/veterinarios/historial-reciente');
    },

    // CREAR HISTORIAL MEDICO
    crearFichaMedica: async (datos: HistorialPayload): Promise<HistorialDetalle> => {
        return api.post<HistorialDetalle>('/veterinarios/historial', datos);
    },

    // OBTENER MASCOTA POR ID (DETALLE COMPLETO)
    obtenerMascotaPorId: async (id: number): Promise<Mascota> => {
        return api.get<Mascota>(`/mascotas/${id}`);
    },

    // ELIMINAR HISTORIAL
    eliminarRegistroHistorial: async (id: number): Promise<boolean> => {
        await api.delete(`/historial/${id}`);
        return true;
    },

    // ACTUALIZAR HISTORIAL
    actualizarRegistroHistorial: async (id: number, datos: HistorialUpdatePayload): Promise<HistorialDetalle> => {
        return api.put<HistorialDetalle>(`/historial/${id}`, datos);
    }
};
