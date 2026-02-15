// DEFINICION DE TIPOS PARA MASCOTAS

export interface Pet {
    id: string;
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
    peso: number;
    imagenUrl?: string;
    ownerId: string;
}
