import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Mascota } from '../../types/mascota.types';
import { api, type ApiResponse } from '../../config/api';

// ESTADO INICIAL
interface EstadoMascotas {
    mascotas: Mascota[];
    cargando: boolean;
    error: string | null;
}

const estadoInicial: EstadoMascotas = {
    mascotas: [],
    cargando: false,
    error: null,
};

// OPERACIONES ASINCRONAS (THUNKS) EN ESPAÑOL
export const obtenerMascotas = createAsyncThunk(
    'mascotas/obtenerTodas',
    async (_, { rejectWithValue }) => {
        try {
            const respuesta = await api.get<ApiResponse<Mascota[]>>('/mascotas');
            return respuesta.data || [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

export const eliminarMascota = createAsyncThunk(
    'mascotas/eliminar',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/mascotas/${id}`);
            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            return rejectWithValue(mensaje);
        }
    }
);

// SLICE DE MASCOTAS
const sliceMascotas = createSlice({
    name: 'mascotas',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // OBTENER
            .addCase(obtenerMascotas.pending, (estado) => {
                estado.cargando = true;
                estado.error = null;
            })
            .addCase(obtenerMascotas.fulfilled, (estado, accion: PayloadAction<Mascota[]>) => {
                estado.cargando = false;
                estado.mascotas = accion.payload;
            })
            .addCase(obtenerMascotas.rejected, (estado, accion) => {
                estado.cargando = false;
                estado.error = accion.payload as string;
            })
            // ELIMINAR
            .addCase(eliminarMascota.pending, (estado) => {
                estado.cargando = true;
                estado.error = null;
            })
            .addCase(eliminarMascota.fulfilled, (estado, accion: PayloadAction<number>) => {
                estado.cargando = false;
                estado.mascotas = estado.mascotas.filter(m => m.id !== accion.payload);
            })
            .addCase(eliminarMascota.rejected, (estado, accion) => {
                estado.cargando = false;
                estado.error = accion.payload as string;
            });
    },
});

export default sliceMascotas.reducer;
