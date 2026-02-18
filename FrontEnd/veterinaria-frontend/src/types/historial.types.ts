// DEFINICION DE TIPOS PARA HISTORIAL MEDICO Y AGENDA

export interface Historial {
    id: number;
    mascota_id: number;
    veterinario_id: number;
    fecha: string;
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
    mascota_nombre?: string;
    dueno_nombre?: string;
    dueno_apellido?: string;
    vet_nombre?: string;
    vet_apellido?: string;
    vet_matricula?: string;
}

export interface HistorialPayload {
    mascota_id: number;
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
}

export interface HistorialUpdatePayload {
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
}

// Para detalles expandidos en vistas
export interface HistorialDetalle extends Historial {
    mascota_especie: string;
}

// Tipos de Agenda (Vets)
export interface AgendaItem {
    id: number;
    fecha_hora: string;
    estado: 'pendiente' | 'confirmado' | 'completado' | 'cancelado' | 'realizado';
    motivo: string;
    mascota_id: number;
    mascota_nombre: string;
    mascota_especie: string;
    dueno_nombre: string;
    dueno_apellido: string;
    servicio: string;
}
