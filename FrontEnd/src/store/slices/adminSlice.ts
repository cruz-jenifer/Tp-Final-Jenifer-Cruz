import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import type { ApiResponse } from '../../config/api';

// TIPOS
import type { Owner as Dueno } from '../../types/owner.types';
import type { Mascota } from '../../types/mascota.types';
import type { Historial } from '../../types/historial.types';

// RE-EXPORTAR
export type { Owner as Dueno } from '../../types/owner.types';
export type { Mascota } from '../../types/mascota.types';
export type { Historial } from '../../types/historial.types';

export interface Veterinario {
    id: number;
    usuario_id: number;
    nombre: string;
    apellido: string;
    email: string;
    matricula: string;
    especialidad?: string;
    clave_temporal?: string;
}

export interface Raza {
    id: number;
    nombre: string;
    especie_id: number;
}

interface EstadoAdmin {
    duenos: Dueno[];
    mascotas: Mascota[];
    veterinarios: Veterinario[];
    razas: Raza[];
    historial: Historial[];
    cargando: boolean;
    error: string | null;
    mensajeExito: string | null;
}

const estadoInicial: EstadoAdmin = {
    duenos: [],
    mascotas: [],
    veterinarios: [],
    razas: [],
    historial: [],
    cargando: false,
    error: null,
    mensajeExito: null
};

// THUNKS ASINCRONOS EN ESPAÑOL

// DUEÑOS
export const obtenerDuenos = createAsyncThunk(
    'admin/obtenerDuenos',
    async (_, { rejectWithValue }) => {
        try {
            const respuesta = await api.get<ApiResponse<Dueno[]>>('/duenos');
            return respuesta.data || [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al obtener dueños';
            return rejectWithValue(mensaje);
        }
    }
);

export const crearDueno = createAsyncThunk(
    'admin/crearDueno',
    async (datos: Partial<Dueno>, { rejectWithValue }) => {
        try {
            const respuesta = await api.post<ApiResponse<Dueno>>('/duenos', datos);
            return respuesta.data!;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al crear dueño';
            return rejectWithValue(mensaje);
        }
    }
);

export const actualizarDueno = createAsyncThunk(
    'admin/actualizarDueno',
    async ({ id, datos }: { id: number; datos: Partial<Dueno> }, { rejectWithValue }) => {
        try {
            const respuesta = await api.put<ApiResponse<Dueno>>(`/duenos/${id}`, datos);
            return respuesta.data!;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al actualizar dueño';
            return rejectWithValue(mensaje);
        }
    }
);

export const eliminarDueno = createAsyncThunk(
    'admin/eliminarDueno',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete<ApiResponse>(`/duenos/${id}`);
            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al eliminar dueño';
            return rejectWithValue(mensaje);
        }
    }
);

// VETERINARIOS
export const fetchVeterinarios = createAsyncThunk(
    'admin/fetchVeterinarios',
    async (_, { rejectWithValue }) => {
        try {
            const respuesta = await api.get<ApiResponse<Veterinario[]>>('/veterinarios');
            return Array.isArray(respuesta.data) ? respuesta.data : [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al obtener veterinarios';
            return rejectWithValue(mensaje);
        }
    }
);

export const crearVeterinario = createAsyncThunk(
    'admin/crearVeterinario',
    async (datos: Partial<Veterinario>, { rejectWithValue }) => {
        try {
            const respuesta = await api.post<ApiResponse<Veterinario>>('/veterinarios', datos);
            return respuesta.data!;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al crear veterinario';
            return rejectWithValue(mensaje);
        }
    }
);

export const actualizarVeterinario = createAsyncThunk(
    'admin/actualizarVeterinario',
    async ({ id, datos }: { id: number; datos: Partial<Veterinario> }, { rejectWithValue }) => {
        try {
            const respuesta = await api.put<ApiResponse<Veterinario>>(`/veterinarios/${id}`, datos);
            return respuesta.data!;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al actualizar veterinario';
            return rejectWithValue(mensaje);
        }
    }
);

export const eliminarVeterinario = createAsyncThunk(
    'admin/eliminarVeterinario',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete<ApiResponse>(`/veterinarios/${id}`);
            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al eliminar veterinario';
            return rejectWithValue(mensaje);
        }
    }
);

// RAZAS
export const obtenerRazas = createAsyncThunk(
    'admin/obtenerRazas',
    async (_, { rejectWithValue }) => {
        try {
            const respuesta = await api.get<ApiResponse<Raza[]>>('/razas');
            return respuesta.data || [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al obtener razas';
            return rejectWithValue(mensaje);
        }
    }
);

// MASCOTAS
export const obtenerMascotasAdmin = createAsyncThunk(
    'admin/obtenerMascotas',
    async (_, { rejectWithValue }) => {
        try {
            const respuesta = await api.get<ApiResponse<Mascota[]>>('/mascotas/admin/all');
            return respuesta.data || [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al obtener mascotas';
            return rejectWithValue(mensaje);
        }
    }
);

export const crearMascotaAdmin = createAsyncThunk(
    'admin/crearMascota',
    async (datos: Partial<Mascota>, { rejectWithValue }) => {
        try {
            const respuesta = await api.post<ApiResponse<Mascota>>('/mascotas', datos);
            return respuesta.data!;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al crear mascota';
            return rejectWithValue(mensaje);
        }
    }
);

export const actualizarMascotaAdmin = createAsyncThunk(
    'admin/actualizarMascota',
    async ({ id, datos }: { id: number; datos: Partial<Mascota> }, { rejectWithValue }) => {
        try {
            await api.put<ApiResponse<Mascota>>(`/mascotas/${id}`, datos);
            return { id, ...datos };
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al actualizar mascota';
            return rejectWithValue(mensaje);
        }
    }
);

export const eliminarMascotaAdmin = createAsyncThunk(
    'admin/eliminarMascota',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete<ApiResponse>(`/mascotas/${id}`);
            return id;
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al eliminar mascota';
            return rejectWithValue(mensaje);
        }
    }
);

// HISTORIAL
export const obtenerHistorialAdmin = createAsyncThunk(
    'admin/obtenerHistorial',
    async (_, { rejectWithValue }) => {
        try {
            const respuesta = await api.get<ApiResponse<Historial[]>>('/historial/admin/all');
            return respuesta.data || [];
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : 'Error al obtener historial';
            return rejectWithValue(mensaje);
        }
    }
);

// SLICE ADMIN
const sliceAdmin = createSlice({
    name: 'admin',
    initialState: estadoInicial,
    reducers: {
        limpiarMensajes: (estado) => {
            estado.error = null;
            estado.mensajeExito = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // DUEÑOS
            .addCase(obtenerDuenos.pending, (estado) => { estado.cargando = true; estado.error = null; })
            .addCase(obtenerDuenos.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.duenos = accion.payload || [];
            })
            .addCase(obtenerDuenos.rejected, (estado, accion) => { estado.cargando = false; estado.error = accion.payload as string; })

            .addCase(crearDueno.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.duenos.push(accion.payload!);
                estado.mensajeExito = 'Dueño creado exitosamente';
            })

            .addCase(actualizarDueno.fulfilled, (estado, accion) => {
                estado.cargando = false;
                const indice = estado.duenos.findIndex(o => o.id === accion.payload!.id);
                if (indice !== -1) {
                    estado.duenos[indice] = accion.payload!;
                }
                estado.mensajeExito = 'Dueño actualizado exitosamente';
            })

            // VETERINARIOS
            .addCase(fetchVeterinarios.pending, (estado) => { estado.cargando = true; estado.error = null; })
            .addCase(fetchVeterinarios.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.veterinarios = accion.payload || [];
            })
            .addCase(fetchVeterinarios.rejected, (estado, accion) => { estado.cargando = false; estado.error = accion.payload as string; })

            .addCase(crearVeterinario.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.veterinarios.push(accion.payload!);
                estado.mensajeExito = 'Veterinario creado exitosamente';
            })

            .addCase(actualizarVeterinario.fulfilled, (estado, accion) => {
                estado.cargando = false;
                const indice = estado.veterinarios.findIndex(v => v.id === accion.payload!.id);
                if (indice !== -1) {
                    estado.veterinarios[indice] = accion.payload!;
                }
                estado.mensajeExito = 'Veterinario actualizado exitosamente';
            })

            .addCase(eliminarVeterinario.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.veterinarios = estado.veterinarios.filter(v => v.id !== accion.payload);
                estado.mensajeExito = 'Veterinario eliminado exitosamente';
            })

            // RAZAS
            .addCase(obtenerRazas.pending, (estado) => { estado.cargando = true; estado.error = null; })
            .addCase(obtenerRazas.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.razas = accion.payload || [];
            })

            // MASCOTAS
            .addCase(obtenerMascotasAdmin.pending, (estado) => { estado.cargando = true; estado.error = null; })
            .addCase(obtenerMascotasAdmin.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.mascotas = accion.payload || [];
            })

            .addCase(crearMascotaAdmin.fulfilled, (estado, accion) => {
                estado.mascotas.push(accion.payload!);
                estado.mensajeExito = 'Mascota registrada exitosamente';
            })

            .addCase(actualizarMascotaAdmin.fulfilled, (estado, accion: any) => {
                const indice = estado.mascotas.findIndex(p => p.id === accion.payload.id);
                if (indice !== -1) {
                    estado.mascotas[indice] = { ...estado.mascotas[indice], ...accion.payload };
                }
                estado.mensajeExito = 'Mascota actualizada exitosamente';
            })

            .addCase(eliminarMascotaAdmin.fulfilled, (estado, accion) => {
                estado.mascotas = estado.mascotas.filter(p => p.id !== accion.payload);
                estado.mensajeExito = 'Mascota eliminada exitosamente';
            })

            // HISTORIAL
            .addCase(obtenerHistorialAdmin.pending, (estado) => { estado.cargando = true; estado.error = null; })
            .addCase(obtenerHistorialAdmin.fulfilled, (estado, accion) => {
                estado.cargando = false;
                estado.historial = accion.payload || [];
            });
    }
});

export const { limpiarMensajes } = sliceAdmin.actions;
export default sliceAdmin.reducer;
