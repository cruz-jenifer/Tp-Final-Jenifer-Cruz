import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Turno } from '../../types/turno.types';
import type { RootState } from '../index'; // IMPORTACION DE ROOTSTATE

// ESTADO INICIAL
interface TurnosState {
    turnos: Turno[];
    loading: boolean;
    error: string | null;
}

const initialState: TurnosState = {
    turnos: [],
    loading: false,
    error: null,
};

// API BASE URL
const API_URL = 'http://localhost:3001/api/turnos';

// OPERACIONES ASINCRONAS (THUNKS)

// OBTENER MIS TURNOS
export const fetchMisTurnos = createAsyncThunk(
    'turnos/fetchMisTurnos',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const response = await fetch(`${API_URL}/mis-turnos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data as Turno[]; // RETORNO DE DATOS
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// CREAR TURNO
export const createTurno = createAsyncThunk(
    'turnos/createTurno',
    async (turno: Partial<Turno>, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(turno)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            // Refetch turnos after creation or return new turno if backend returns it
            // RECARGA DE TURNOS DESPUES DE CREACION
            return await response.json();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// CANCELAR TURNO
export const cancelTurno = createAsyncThunk(
    'turnos/cancelTurno',
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// ACTUALIZAR TURNO
export const updateTurno = createAsyncThunk(
    'turnos/updateTurno',
    async ({ id, data }: { id: number; data: Partial<Turno> }, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            return { id, data };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// ELIMINAR TURNO (FISICO)
export const deleteTurno = createAsyncThunk(
    'turnos/deleteTurno',
    async (id: number, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const response = await fetch(`${API_URL}/${id}?force=true`, {
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
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// THUNK LOGIN ADMIN AGENDA
export const fetchAgendaAdmin = createAsyncThunk(
    'turnos/fetchAgendaAdmin',
    async (fecha: string | undefined, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const url = fecha ? `${API_URL}/agenda?fecha=${fecha}` : `${API_URL}/agenda`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al cargar agenda');
            }

            const data = await response.json();
            return data.turnos || [];
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// CHECK AVAILABILITY
export const checkAvailability = createAsyncThunk(
    'turnos/checkAvailability',
    async ({ veterinario_id, fecha, hora }: { veterinario_id: number; fecha: string; hora: string }, { getState, rejectWithValue }) => {
        try {
            const token = (getState() as RootState).auth.token;
            if (!token) throw new Error('No token found');

            const response = await fetch(`${API_URL}/check-availability?veterinario_id=${veterinario_id}&fecha=${fecha}&hora=${hora}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error checking availability');

            const data = await response.json();
            return data.disponible;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

// SLICE
const turnosSlice = createSlice({
    name: 'turnos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // FETCH MIS TURNOS
        builder.addCase(fetchMisTurnos.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchMisTurnos.fulfilled, (state, action) => { state.loading = false; state.turnos = action.payload; });
        builder.addCase(fetchMisTurnos.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // CREATE TURNO
        builder.addCase(createTurno.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(createTurno.fulfilled, (state) => { state.loading = false; });
        builder.addCase(createTurno.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // CANCEL TURNO
        builder.addCase(cancelTurno.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(cancelTurno.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.turnos.findIndex(t => t.id === action.payload);
            if (index !== -1) state.turnos[index].estado = 'cancelado';
        });
        builder.addCase(cancelTurno.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // UPDATE TURNO
        builder.addCase(updateTurno.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.turnos.findIndex(t => t.id === action.payload.id);
            if (index !== -1) state.turnos[index] = { ...state.turnos[index], ...action.payload.data };
        });

        // DELETE TURNO
        builder.addCase(deleteTurno.fulfilled, (state, action) => {
            state.loading = false;
            state.turnos = state.turnos.filter(t => t.id !== action.payload);
        });

        // FETCH AGENDA ADMIN
        builder.addCase(fetchAgendaAdmin.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchAgendaAdmin.fulfilled, (state, action) => {
            state.loading = false;
            state.turnos = action.payload;
        });
        builder.addCase(fetchAgendaAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
    }
});

export const { } = turnosSlice.actions;
export default turnosSlice.reducer;
