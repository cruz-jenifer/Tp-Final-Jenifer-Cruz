// DATOS DE PRUEBA PARA EL DASHBOARD DE CLIENTE

import type { Mascota } from '../types/mascota.types';
import type { Turno } from '../types/turno.types';

// MOCK DE MASCOTAS
export const mockPets: Mascota[] = [
    {
        id: 1,
        nombre: 'Firulais',
        especie: 'Perro',
        raza: 'Golden Retriever',
        fecha_nacimiento: '2020-01-01',
        dueno_id: 1,
        // advertencias: 'None'
    },
    {
        id: 2,
        nombre: 'Michi',
        especie: 'Gato',
        raza: 'Siames',
        fecha_nacimiento: '2021-05-15',
        dueno_id: 1
    },
    {
        id: 3,
        nombre: 'Rocky',
        especie: 'Perro',
        raza: 'Bulldog',
        fecha_nacimiento: '2018-08-20',
        dueno_id: 1
    }
];

// MOCK DE TURNOS
export const mockTurnos: Turno[] = [
    {
        id: 1,
        fecha_hora: '2023-11-20 10:00:00',
        motivo: 'Vacunación anual',
        estado: 'pendiente',
        mascota: 'Firulais',
        veterinario_nombre: 'Dr. House',
        mascota_id: 1,
        servicio_id: 1,
        veterinario_id: 1
    },
    {
        id: 2,
        fecha_hora: '2023-11-22 15:30:00',
        motivo: 'Consulta general',
        estado: 'confirmado',
        mascota: 'Michi',
        veterinario_nombre: 'Dra. Grey',
        mascota_id: 2,
        servicio_id: 1,
        veterinario_id: 2
    },
    {
        id: 3,
        fecha_hora: '2023-10-15 09:00:00',
        motivo: 'Corte de uñas',
        estado: 'realizado',
        mascota: 'Firulais',
        veterinario_nombre: 'Dr. House',
        mascota_id: 1,
        servicio_id: 2,
        veterinario_id: 1
    },
    {
        id: 4,
        fecha_hora: '2023-12-01 11:00:00',
        motivo: 'Desparasitación',
        estado: 'cancelado',
        mascota: 'Rocky',
        mascota_id: 3
    }
];
