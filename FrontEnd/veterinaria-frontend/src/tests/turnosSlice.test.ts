import { describe, it, expect } from 'vitest';
import turnosReducer, { fetchMisTurnos } from '../store/slices/turnosSlice';
import type { Turno } from '../types/turno.types';

describe('turnosSlice', () => {
    const initialState = {
        turnos: [],
        loading: false,
        error: null,
    };

    it('DEBERIA MANEJAR EL ESTADO INICIAL', () => {
        expect(turnosReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('DEBERIA MANEJAR FETCHMISTURNOS.PENDING', () => {
        const action = { type: fetchMisTurnos.pending.type };
        const state = turnosReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
    });

    it('DEBERIA MANEJAR FETCHMISTURNOS.FULFILLED', () => {
        const mockTurnos: Turno[] = [{ id: 1, fecha_hora: '2023-01-01 10:00:00', estado: 'pendiente', motivo: 'Test' }];
        const action = { type: fetchMisTurnos.fulfilled.type, payload: mockTurnos };
        const state = turnosReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.turnos).toEqual(mockTurnos);
    });

    it('DEBERIA MANEJAR FETCHMISTURNOS.REJECTED', () => {
        const action = { type: fetchMisTurnos.rejected.type, payload: 'Error fetching' };
        const state = turnosReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Error fetching');
    });
});
