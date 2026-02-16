import { describe, it, expect } from 'vitest';
import mascotasReducer, { fetchMascotas } from '../store/slices/mascotasSlice';
import { mockPets } from '../mocks/clientData';

describe('mascotasSlice', () => {
    const initialState = {
        mascotas: [],
        loading: false,
        error: null,
    };

    it('should handle initial state', () => {
        expect(mascotasReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle fetchMascotas.pending', () => {
        const action = { type: fetchMascotas.pending.type };
        const state = mascotasReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should handle fetchMascotas.fulfilled', () => {
        const action = { type: fetchMascotas.fulfilled.type, payload: mockPets };
        const state = mascotasReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.mascotas).toEqual(mockPets);
    });

    it('should handle fetchMascotas.rejected', () => {
        const action = { type: fetchMascotas.rejected.type, payload: 'Error fetching', error: { message: 'Error fetching' } };
        const state = mascotasReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Error fetching');
    });
});
