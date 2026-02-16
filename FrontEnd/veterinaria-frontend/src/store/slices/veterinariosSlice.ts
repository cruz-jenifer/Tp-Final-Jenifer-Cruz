import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000/api';

// TIPOS
export interface Veterinario {
    id: number;
    nombre: string;
    apellido: string;
    especialidad?: string;
    telefono?: string;
    email?: string;
}

interface VeterinariosState {
    veterinarios: Veterinario[];
    loading: boolean;
    error: string | null;
}

const initialState: VeterinariosState = {
    veterinarios: [],
    loading: false,
    error: null,
};

// ASYNC THUNKS
export const fetchVeterinarios = createAsyncThunk(
    'veterinarios/fetchAll',
    async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/veterinarios`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Error al cargar veterinarios');
        }

        return response.json();
    }
);

// SLICE
const veterinariosSlice = createSlice({
    name: 'veterinarios',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVeterinarios.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVeterinarios.fulfilled, (state, action) => {
                state.loading = false;
                state.veterinarios = action.payload;
            })
            .addCase(fetchVeterinarios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error al cargar veterinarios';
            });
    },
});

export default veterinariosSlice.reducer;
