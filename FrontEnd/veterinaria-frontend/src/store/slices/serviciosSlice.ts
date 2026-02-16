import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000/api';

// TIPOS
export interface Servicio {
    id: number;
    nombre: string;
    duracion_minutos?: number;
}

interface ServiciosState {
    servicios: Servicio[];
    loading: boolean;
    error: string | null;
}

const initialState: ServiciosState = {
    servicios: [],
    loading: false,
    error: null,
};

// ASYNC THUNKS
export const fetchServicios = createAsyncThunk(
    'servicios/fetchAll',
    async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/servicios`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Error al cargar servicios');
        }

        return response.json();
    }
);

// SLICE
const serviciosSlice = createSlice({
    name: 'servicios',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServicios.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServicios.fulfilled, (state, action) => {
                state.loading = false;
                // LA API DEVUELVE { success, data: [...] }
                state.servicios = action.payload.data || action.payload;
            })
            .addCase(fetchServicios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error al cargar servicios';
            });
    },
});

export default serviciosSlice.reducer;
