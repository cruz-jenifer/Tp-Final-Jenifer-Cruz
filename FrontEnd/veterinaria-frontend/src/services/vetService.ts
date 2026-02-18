
import { api } from '../config/api';
import type { HistorialPayload, HistorialUpdatePayload, AgendaItem, HistorialDetalle } from '../types/historial.types';
import type { Mascota } from '../types/mascota.types';

interface AgendaResponse {
    fecha: string;
    total_turnos: number;
    turnos: AgendaItem[];
}

// SERVICIO PARA OPERACIONES DEL VETERINARIO
// UTILIZA EL WRAPPER CENTRALIZADO DE API (config/api.ts)
export const vetService = {
    // OBTENER AGENDA DEL DIA
    getAgenda: async (fecha: string): Promise<AgendaResponse> => {
        return api.get<AgendaResponse>(`/veterinarios/agenda?fecha=${fecha}`);
    },

    // OBTENER HISTORIAL RECIENTE (ULTIMOS 5 REGISTROS)
    getRecentRecords: async (): Promise<HistorialDetalle[]> => {
        return api.get<HistorialDetalle[]>('/veterinarios/historial-reciente');
    },

    // CREAR HISTORIAL MEDICO
    createMedicalRecord: async (data: HistorialPayload): Promise<HistorialDetalle> => {
        return api.post<HistorialDetalle>('/veterinarios/historial', data);
    },

    // OBTENER MASCOTA POR ID (DETALLE COMPLETO)
    getMascotaById: async (id: number): Promise<Mascota> => {
        return api.get<Mascota>(`/mascotas/${id}`);
    },

    // ELIMINAR HISTORIAL
    deleteMedicalRecord: async (id: number): Promise<boolean> => {
        await api.delete(`/historial/${id}`);
        return true;
    },

    // ACTUALIZAR HISTORIAL
    updateMedicalRecord: async (id: number, data: HistorialUpdatePayload): Promise<HistorialDetalle> => {
        return api.put<HistorialDetalle>(`/historial/${id}`, data);
    }
};
