import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ClientDashboard from '../features/client/ClientDashboard';
import mascotasReducer, { fetchMascotas } from '../store/slices/mascotasSlice';
import turnosReducer, { fetchMisTurnos } from '../store/slices/turnosSlice';
import type { Turno } from '../types/turno.types';
import type { Pet } from '../types/pet.types';

// DATOS SIMULADOS LOCALES
const localMockPets: Pet[] = [
    {
        id: 1, nombre: 'Firulais', especie: 'Perro', raza: 'Golden', fecha_nacimiento: '2020-01-01', dueno_id: 1,
    },
    {
        id: 2, nombre: 'Michi', especie: 'Gato', raza: 'Siames', fecha_nacimiento: '2021-05-15', dueno_id: 1
    }
];

const localMockTurnos: Turno[] = [
    {
        id: 1, mascota: 'Firulais', fecha_hora: '2023-11-20 10:00:00',
        motivo: 'Vacuna', estado: 'pendiente', veterinario_nombre: 'Dr. House'
    }
];

// AYUDANTE DE ALMACEN
const createTestStore = () => configureStore({
    reducer: {
        mascotas: mascotasReducer,
        turnos: turnosReducer,
        auth: (state = { token: 'fake-token' }) => state
    }
});

describe('INTEGRACION DE TABLERO DE CLIENTE', () => {

    it('DEBERIA MOSTRAR MASCOTAS Y TURNOS CUANDO LOS DATOS YA ESTAN CARGADOS', async () => {
        const store = createTestStore();

        // PRECARGA DE ESTADO
        store.dispatch(fetchMascotas.fulfilled(localMockPets, 'req-1', undefined));
        store.dispatch(fetchMisTurnos.fulfilled(localMockTurnos, 'req-2', undefined));

        render(
            <Provider store={store}>
                <ClientDashboard />
            </Provider>
        );

        // DEBERIA RENDERIZAR DATOS
        expect(screen.getAllByText('Firulais').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Michi').length).toBeGreaterThan(0);
        expect(screen.getAllByText('PENDIENTE').length).toBeGreaterThan(0);
    });

    it('DEBERIA MOSTRAR ESTADO DE CARGA SI LOS DATOS ESTAN VACIOS', async () => {
        const store = createTestStore();
        render(
            <Provider store={store}>
                <ClientDashboard />
            </Provider>
        );

        // RENDER INICIAL DESENCADENA FETCH PORQUE DATOS VACIOS
        await waitFor(() => {
            expect(screen.getByText(/Cargando mascotas.../i)).toBeInTheDocument();
        });
    });
});
