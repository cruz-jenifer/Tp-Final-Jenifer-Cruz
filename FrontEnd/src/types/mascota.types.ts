// DEFINICION DE TIPOS PARA MASCOTAS (ADMIN)

export interface Mascota {
    id: number;
    dueno_id: number;
    raza_id: number;
    nombre: string;
    fecha_nacimiento: string;
    created_at?: string;
    // CAMPOS EXPANDIDOS DE JOINS
    raza?: string;
    especie?: string;
    dueno_nombre?: string;
    dueno_apellido?: string;
}
