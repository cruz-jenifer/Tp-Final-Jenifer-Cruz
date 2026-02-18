
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vetService } from '../../services/vetService';
import type { AgendaItem, HistorialDetalle, HistorialPayload, HistorialUpdatePayload } from '../../types/historial.types';

interface VetState {
    agenda: AgendaItem[];
    historialesRecientes: HistorialDetalle[];
    loading: boolean;
    error: string | null;
}

const initialState: VetState = {
    agenda: [],
    historialesRecientes: [],
    loading: false,
    error: null,
};

// THUNKS
export const fetchAgenda = createAsyncThunk(
    'vet/fetchAgenda',
    async (fecha: string, { rejectWithValue }) => {
        try {
            const data = await vetService.getAgenda(fecha);
            return data.turnos; // El backend devuelve { fecha, total_turnos, turnos: [] }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

export const fetchHistorialReciente = createAsyncThunk(
    'vet/fetchHistorialReciente',
    async (_, { rejectWithValue }) => {
        try {
            return await vetService.getRecentRecords();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

export const createHistorial = createAsyncThunk(
    'vet/createHistorial',
    async (data: HistorialPayload, { rejectWithValue, dispatch }) => {
        try {
            const result = await vetService.createMedicalRecord(data);
            dispatch(fetchHistorialReciente()); // Recargar lista
            return result;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

export const fetchMascotaById = createAsyncThunk(
    'vet/fetchMascotaById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await vetService.getMascotaById(id);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

export const deleteHistorial = createAsyncThunk(
    'vet/deleteHistorial',
    async (id: number, { rejectWithValue, dispatch }) => {
        try {
            await vetService.deleteMedicalRecord(id);
            dispatch(fetchHistorialReciente());
            return id;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

export const updateHistorial = createAsyncThunk(
    'vet/updateHistorial',
    async ({ id, data }: { id: number, data: HistorialUpdatePayload }, { rejectWithValue, dispatch }) => {
        try {
            await vetService.updateMedicalRecord(id, data);
            dispatch(fetchHistorialReciente());
            return id;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(message);
        }
    }
);

const vetSlice = createSlice({
    name: 'vet',
    initialState,
    reducers: {
        clearVetState: (state) => {
            state.agenda = [];
            state.historialesRecientes = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Agenda
            .addCase(fetchAgenda.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAgenda.fulfilled, (state, action) => {
                state.loading = false;
                state.agenda = action.payload;
            })
            .addCase(fetchAgenda.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Historial Reciente
            .addCase(fetchHistorialReciente.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHistorialReciente.fulfilled, (state, action) => {
                state.loading = false;
                state.historialesRecientes = action.payload;
            })
            .addCase(fetchHistorialReciente.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createHistorial.pending, (state) => {
                state.loading = true;
            })
            .addCase(createHistorial.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createHistorial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchMascotaById.pending, () => {

            })
            .addCase(fetchMascotaById.fulfilled, () => {
            });
    }
});

export const { clearVetState } = vetSlice.actions;
export default vetSlice.reducer;
