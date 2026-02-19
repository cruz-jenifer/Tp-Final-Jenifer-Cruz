// DEFINICION DE TIPOS PARA HISTORIAL MEDICO Y AGENDA

export interface Historial {
    id: number;
    mascota_id: number;
    veterinario_id: number;
    fecha: string;
    diagnostico: string;
    tratamiento: string;
    created_at?: string;
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
}

export interface HistorialUpdatePayload {
    diagnostico: string;
    tratamiento: string;
}

// DETALLES EXPANDIDOS EN VISTAS
export interface HistorialDetalle extends Historial {
    mascota_especie?: string;
}

// TIPOS DE AGENDA (VETS)
export interface AgendaItem {
    id: number;
    fecha: string;
    hora: string;
    estado: 'pendiente' | 'confirmado' | 'completado' | 'cancelado';
    motivo_consulta: string;
    mascota_id: number;
    mascota_nombre: string;
    mascota_especie: string;
    dueno_nombre: string;
    dueno_apellido: string;
    servicio: string;
}
