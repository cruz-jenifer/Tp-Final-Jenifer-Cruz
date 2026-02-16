// DEFINICION DE TIPOS PARA MASCOTAS

export interface Pet {
    id: number; // BACKEND USA NUMBER
    nombre: string;
    especie: string;
    raza: string;
    fecha_nacimiento: string; // BACKEND ENVIA STRING/DATE
    advertencias?: string;
    dueno_id: number;
}
