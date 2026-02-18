import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001/api';

// TIPOS
export interface Veterinario {
    id: number;
    nombre: string;
    apellido: string;
    especialidad?: string;
    telefono?: string;
    email?: string;
    matricula?: string;
    clave_temporal?: string;
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
// CREAR
export const createVeterinario = createAsyncThunk(
    'veterinarios/create',
    async (data: Partial<Veterinario>, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/veterinarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear veterinario');
            }
            const resData = await response.json();
            return resData.data; // Backend devuelve { message, data: ... }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// ACTUALIZAR
export const updateVeterinario = createAsyncThunk(
    'veterinarios/update',
    async ({ id, data }: { id: number; data: Partial<Veterinario> }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/veterinarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al actualizar veterinario');
            const resData = await response.json();
            return resData.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// ELIMINAR
export const deleteVeterinario = createAsyncThunk(
    'veterinarios/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/veterinarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al eliminar veterinario');
            return id;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

const veterinariosSlice = createSlice({
    name: 'veterinarios',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVeterinarios.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchVeterinarios.fulfilled, (state, action) => {
                state.loading = false;
                state.veterinarios = action.payload;
            })
            .addCase(fetchVeterinarios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error al cargar veterinarios';
            })
            // CREATE
            .addCase(createVeterinario.fulfilled, (state, action) => {
                state.veterinarios.push(action.payload);
            })
            // UPDATE
            .addCase(updateVeterinario.fulfilled, (state, action) => {
                const index = state.veterinarios.findIndex(v => v.id === action.payload.id);
                if (index !== -1) state.veterinarios[index] = action.payload;
            })
            // DELETE
            .addCase(deleteVeterinario.fulfilled, (state, action) => {
                state.veterinarios = state.veterinarios.filter(v => v.id !== action.payload);
            });
    },
});

export default veterinariosSlice.reducer;
