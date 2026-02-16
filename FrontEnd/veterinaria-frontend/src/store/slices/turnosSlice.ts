import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
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
const API_URL = 'http://localhost:3000/api/turnos';

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
        } catch (error: any) {
            return rejectWithValue(error.message);
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
        } catch (error: any) {
            return rejectWithValue(error.message);
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
        } catch (error: any) {
            return rejectWithValue(error.message);
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
        } catch (error: any) {
            return rejectWithValue(error.message);
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
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// SLICE DE TURNOS
const turnosSlice = createSlice({
    name: 'turnos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // OBTENER
            .addCase(fetchMisTurnos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMisTurnos.fulfilled, (state, action: PayloadAction<Turno[]>) => {
                state.loading = false;
                state.turnos = action.payload;
            })
            .addCase(fetchMisTurnos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // CREAR
            .addCase(createTurno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTurno.fulfilled, (state) => {
                state.loading = false;
                // ACTUALIZACION DE ESTADO
            })
            .addCase(createTurno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // CANCELAR
            .addCase(cancelTurno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelTurno.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                // ACTUALIZACION DE LISTA
                const index = state.turnos.findIndex(t => t.id === action.payload);
                if (index !== -1) {
                    state.turnos[index].estado = 'cancelado';
                }
            })
            .addCase(cancelTurno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // ACTUALIZAR
            .addCase(updateTurno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTurno.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.turnos.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.turnos[index] = { ...state.turnos[index], ...action.payload.data };
                }
            })
            .addCase(updateTurno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // ELIMINAR (FISICO)
            .addCase(deleteTurno.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTurno.fulfilled, (state, action) => {
                state.loading = false;
                state.turnos = state.turnos.filter(t => t.id !== action.payload);
            })
            .addCase(deleteTurno.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default turnosSlice.reducer;
