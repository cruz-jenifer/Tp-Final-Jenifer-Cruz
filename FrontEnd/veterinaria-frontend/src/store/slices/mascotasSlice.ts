import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Mascota } from '../../types/mascota.types';
import { api } from '../../config/api';

// ESTADO INICIAL
interface MascotasState {
    mascotas: Mascota[];
    loading: boolean;
    error: string | null;
}

const initialState: MascotasState = {
    mascotas: [],
    loading: false,
    error: null,
};

// OPERACIONES ASINCRONAS (THUNKS)
export const fetchMascotas = createAsyncThunk(
    'mascotas/fetchMascotas',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<{ data: Mascota[] }>('/mascotas');
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// ELIMINAR MASCOTA
export const deleteMascota = createAsyncThunk(
    'mascotas/deleteMascota',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/mascotas/${id}`);
            return id;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
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
            .addCase(fetchMascotas.fulfilled, (state, action: PayloadAction<Mascota[]>) => {
                state.loading = false;
                state.mascotas = action.payload;
            })
            .addCase(fetchMascotas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // ELIMINAR
            .addCase(deleteMascota.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMascota.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.mascotas = state.mascotas.filter(m => m.id !== action.payload);
            })
            .addCase(deleteMascota.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default mascotasSlice.reducer;
