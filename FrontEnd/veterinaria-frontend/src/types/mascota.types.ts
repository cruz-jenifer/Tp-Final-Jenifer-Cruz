// DEFINICION DE TIPOS PARA MASCOTAS (ADMIN)

export interface Mascota {
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    fecha_nacimiento: string;
    dueno_id: number;
    advertencias?: string; // CAMPO OPCIONAL DEL BACKEND
    dueno_nombre?: string; // JOIN CON DUEÑO
    dueno_apellido?: string; // JOIN CON DUEÑO
}
