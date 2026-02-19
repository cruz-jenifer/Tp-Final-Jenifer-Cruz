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
        raza_id: 1
    },
    {
        id: 2,
        nombre: 'Michi',
        especie: 'Gato',
        raza: 'Siames',
        fecha_nacimiento: '2021-05-15',
        dueno_id: 1,
        raza_id: 2
    },
    {
        id: 3,
        nombre: 'Rocky',
        especie: 'Perro',
        raza: 'Bulldog',
        fecha_nacimiento: '2018-08-20',
        dueno_id: 1,
        raza_id: 3
    }
];

// MOCK DE TURNOS
export const mockTurnos: Turno[] = [
    {
        id: 1,
        fecha: '2026-11-20',
        hora: '10:00:00',
        motivo_consulta: 'Vacunación anual',
        estado: 'pendiente',
        mascota: 'Firulais',
        veterinario_nombre: 'Dr. House',
        mascota_id: 1,
        servicio_id: 1,
        veterinario_id: 1
    },
    {
        id: 2,
        fecha: '2026-11-22',
        hora: '15:30:00',
        motivo_consulta: 'Consulta general',
        estado: 'confirmado',
        mascota: 'Michi',
        veterinario_nombre: 'Dra. Grey',
        mascota_id: 2,
        servicio_id: 1,
        veterinario_id: 2
    },
    {
        id: 3,
        fecha: '2026-10-15',
        hora: '09:00:00',
        motivo_consulta: 'Corte de uñas',
        estado: 'completado',
        mascota: 'Firulais',
        veterinario_nombre: 'Dr. House',
        mascota_id: 1,
        servicio_id: 2,
        veterinario_id: 1
    },
    {
        id: 4,
        fecha: '2026-12-01',
        hora: '11:00:00',
        motivo_consulta: 'Desparasitación',
        estado: 'cancelado',
        mascota: 'Rocky',
        mascota_id: 3
    }
];
