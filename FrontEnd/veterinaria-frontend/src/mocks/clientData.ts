// DATOS DE PRUEBA PARA EL DASHBOARD DE CLIENTE

import type { Pet } from '../types/pet.types';
import type { Turno } from '../types/turno.types';

// MOCK DE MASCOTAS
export const mockPets: Pet[] = [
    {
        id: '1',
        nombre: 'Firulais',
        especie: 'Perro',
        raza: 'Golden Retriever',
        edad: 3,
        peso: 25,
        ownerId: 'u1',
        imagenUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80'
    },
    {
        id: '2',
        nombre: 'Michi',
        especie: 'Gato',
        raza: 'Siames',
        edad: 2,
        peso: 4,
        ownerId: 'u1',
        imagenUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'
    },
    {
        id: '3',
        nombre: 'Rocky',
        especie: 'Perro',
        raza: 'Bulldog',
        edad: 5,
        peso: 18,
        ownerId: 'u1'
    }
];

// MOCK DE TURNOS
export const mockTurnos: Turno[] = [
    {
        id: 't1',
        mascotaId: '1',
        mascotaNombre: 'Firulais',
        fecha: '2023-11-20',
        hora: '10:00',
        motivo: 'Vacunación anual',
        estado: 'pendiente',
        veterinarioNombre: 'Dr. House'
    },
    {
        id: 't2',
        mascotaId: '2',
        mascotaNombre: 'Michi',
        fecha: '2023-11-22',
        hora: '15:30',
        motivo: 'Consulta general',
        estado: 'confirmado',
        veterinarioNombre: 'Dra. Grey'
    },
    {
        id: 't3',
        mascotaId: '1',
        mascotaNombre: 'Firulais',
        fecha: '2023-10-15',
        hora: '09:00',
        motivo: 'Corte de uñas',
        estado: 'realizado',
        veterinarioNombre: 'Dr. House'
    },
    {
        id: 't4',
        mascotaId: '3',
        mascotaNombre: 'Rocky',
        fecha: '2023-12-01',
        hora: '11:00',
        motivo: 'Desparasitación',
        estado: 'cancelado'
    }
];
