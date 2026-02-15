import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Pet } from '../../types/pet.types';
import { mockPets } from '../../mocks/clientData';

// ESTADO INICIAL
interface MascotasState {
    mascotas: Pet[];
    loading: boolean;
    error: string | null;
}

const initialState: MascotasState = {
    mascotas: [],
    loading: false,
    error: null,
};

// ASYNC THUNKS
export const fetchMascotas = createAsyncThunk(
    'mascotas/fetchMascotas',
    async () => {
        // SIMULACION DE LLAMADA A API
        return new Promise<Pet[]>((resolve) => {
            setTimeout(() => {
                resolve(mockPets);
            }, 1000);
        });
    }
);

// SLICE DE MASCOTAS
const mascotasSlice = createSlice({
    name: 'mascotas',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMascotas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMascotas.fulfilled, (state, action: PayloadAction<Pet[]>) => {
                state.loading = false;
                state.mascotas = action.payload;
            })
            .addCase(fetchMascotas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error al cargar mascotas';
            });
    },
});

export default mascotasSlice.reducer;
