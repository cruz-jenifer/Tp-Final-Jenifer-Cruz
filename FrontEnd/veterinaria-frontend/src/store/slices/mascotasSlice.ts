import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Pet } from '../../types/pet.types';
import type { RootState } from '../index'; // IMPORTACION DE ROOTSTATE

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

// API BASE URL
const API_URL = 'http://localhost:3000/api/mascotas';

// OPERACIONES ASINCRONAS (THUNKS)
export const fetchMascotas = createAsyncThunk(
    'mascotas/fetchMascotas',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data as Pet[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// ELIMINAR MASCOTA
export const deleteMascota = createAsyncThunk(
    'mascotas/deleteMascota',
    async (id: number, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
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
            .addCase(fetchMascotas.fulfilled, (state, action: PayloadAction<Pet[]>) => {
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
