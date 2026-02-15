import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Turno } from '../../types/turno.types';
import { mockTurnos } from '../../mocks/clientData';

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

// ASYNC THUNKS
export const fetchTurnos = createAsyncThunk(
    'turnos/fetchTurnos',
    async () => {
        // SIMULACION DE LLAMADA A API
        return new Promise<Turno[]>((resolve) => {
            setTimeout(() => {
                resolve(mockTurnos);
            }, 1000);
        });
    }
);

// SLICE DE TURNOS
const turnosSlice = createSlice({
    name: 'turnos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTurnos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTurnos.fulfilled, (state, action: PayloadAction<Turno[]>) => {
                state.loading = false;
                state.turnos = action.payload;
            })
            .addCase(fetchTurnos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error al cargar turnos';
            });
    },
});

export default turnosSlice.reducer;
