import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { servicioVet } from '../../services/vetService';
import type { AgendaItem, HistorialDetalle, HistorialPayload, HistorialUpdatePayload } from '../../types/historial.types';

interface EstadoVeterinario {
    agenda: AgendaItem[];
    historialesRecientes: HistorialDetalle[];
    cargando: boolean;
    error: string | null;
}

const estadoInicial: EstadoVeterinario = {
    agenda: [],
    historialesRecientes: [],
    cargando: false,
    error: null,
};

// ACCIONES ASÍNCRONAS EN ESPAÑOL
export const obtenerAgenda = createAsyncThunk(
    'vet/obtenerAgenda',
    async (fecha: string, { rejectWithValue }) => {
        try {
            const respuesta = await servicioVet.obtenerAgenda(fecha);
            // @ts-ignore
            return respuesta.data.turnos || [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

export const obtenerHistorialReciente = createAsyncThunk(
    'vet/obtenerHistorialReciente',
    async (_, { rejectWithValue }) => {
        try {
            return await servicioVet.obtenerHistorialReciente();
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

export const crearHistorial = createAsyncThunk(
    'vet/crearHistorial',
    async (datos: HistorialPayload, { rejectWithValue, dispatch }) => {
        try {
            const resultado = await servicioVet.crearFichaMedica(datos);
            dispatch(obtenerHistorialReciente());
            return resultado;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

export const obtenerMascotaPorId = createAsyncThunk(
    'vet/obtenerMascotaPorId',
    async (id: number, { rejectWithValue }) => {
        try {
            return await servicioVet.obtenerMascotaPorId(id);
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

export const eliminarHistorial = createAsyncThunk(
    'vet/eliminarHistorial',
    async (id: number, { rejectWithValue, dispatch }) => {
        try {
            await servicioVet.eliminarRegistroHistorial(id);
            dispatch(obtenerHistorialReciente());
            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

export const actualizarHistorial = createAsyncThunk(
    'vet/actualizarHistorial',
    async ({ id, datos }: { id: number, datos: HistorialUpdatePayload }, { rejectWithValue, dispatch }) => {
        try {
            await servicioVet.actualizarRegistroHistorial(id, datos);
            dispatch(obtenerHistorialReciente());
            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// SLICE VET
const sliceVeterinario = createSlice({
    name: 'vet',
    initialState: estadoInicial,
    reducers: {
        limpiarEstadoVet: (estado) => {
            estado.agenda = [];
            estado.historialesRecientes = [];
            estado.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // AGENDA
            .addCase(obtenerAgenda.pending, (estado) => {
                estado.cargando = true;
                estado.error = null;
            })
            .addCase(obtenerAgenda.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.agenda = accion.payload;
            })
            .addCase(obtenerAgenda.rejected, (estado, accion) => {
                estado.cargando = false;
                estado.error = accion.payload as string;
            })
            // HISTORIAL RECIENTE
            .addCase(obtenerHistorialReciente.pending, (estado) => {
                estado.cargando = true;
            })
            .addCase(obtenerHistorialReciente.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.historialesRecientes = accion.payload;
            })
            .addCase(obtenerHistorialReciente.rejected, (estado, accion) => {
                estado.cargando = false;
                estado.error = accion.payload as string;
            })
            // CREAR
            .addCase(crearHistorial.pending, (estado) => {
                estado.cargando = true;
            })
            .addCase(crearHistorial.fulfilled, (estado) => {
                estado.cargando = false;
            })
            .addCase(crearHistorial.rejected, (estado, accion) => {
                estado.cargando = false;
                estado.error = accion.payload as string;
            });
    }
});

export const { limpiarEstadoVet } = sliceVeterinario.actions;
export default sliceVeterinario.reducer;
