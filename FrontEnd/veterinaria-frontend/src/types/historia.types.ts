export interface IHistorial {
    id: number;
    mascota_id: number;
    veterinario_id: number;
    fecha: string;
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
    vet_nombre?: string;
    vet_apellido?: string;
    vet_matricula?: string;
}

export interface IHistorialPayload {
    mascota_id: number;
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
}

export interface IHistorialDetalle {
    id: number;
    mascota_id: number;
    fecha: string;
    diagnostico: string;
    tratamiento: string;
    mascota_nombre: string;
    mascota_especie: string;
    dueno_nombre: string;
    dueno_apellido: string;
}

export interface IAgendaItem {
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

export interface IMascota {
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    fecha_nacimiento: string;
    advertencias: string;
    dueno_id: number;
    // Agregamos campos opcionales por si vienen del join
    dueno_nombre?: string;
    dueno_apellido?: string;
}
