
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import type { ApiResponse } from '../../config/api';

// TIPOS IMPORTADOS DESDE ARCHIVOS DEDICADOS
import type { Owner } from '../../types/owner.types';
import type { Mascota } from '../../types/mascota.types';
import type { Historial } from '../../types/historial.types';

// RE-EXPORTAR PARA COMPATIBILIDAD CON IMPORTS EXISTENTES
export type { Owner } from '../../types/owner.types';
export type { Mascota } from '../../types/mascota.types';
export type { Historial } from '../../types/historial.types';

interface AdminState {
    owners: Owner[];
    pets: Mascota[];
    history: Historial[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: AdminState = {
    owners: [],
    pets: [],
    history: [],
    loading: false,
    error: null,
    successMessage: null
};

// THUNKS ASINCRONOS

// OBTENER TODOS LOS DUEÑOS
export const fetchDuenos = createAsyncThunk(
    'admin/fetchDuenos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Owner[]>>('/duenos');
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al obtener dueños';
            return rejectWithValue(message);
        }
    }
);

// CREAR DUEÑO
export const createDueno = createAsyncThunk(
    'admin/createDueno',
    async (ownerData: Partial<Owner>, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Owner>>('/duenos', ownerData);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al crear dueño';
            if (message === 'El email ya está registrado') {
                return rejectWithValue('El email ya está registrado');
            }
            return rejectWithValue(message);
        }
    }
);

// ACTUALIZAR DUEÑO
export const updateDueno = createAsyncThunk(
    'admin/updateDueno',
    async ({ id, data }: { id: number; data: Partial<Owner> }, { rejectWithValue }) => {
        try {
            const response = await api.put<ApiResponse<Owner>>(`/duenos/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al actualizar dueño';
            return rejectWithValue(message);
        }
    }
);

// ELIMINAR DUEÑO
export const deleteDueno = createAsyncThunk(
    'admin/deleteDueno',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete<ApiResponse>(`/duenos/${id}`);
            return id;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al eliminar dueño';
            return rejectWithValue(message);
        }
    }
);

// --- MASCOTAS ---

export const fetchMascotas = createAsyncThunk(
    'admin/fetchMascotas',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Mascota[]>>('/mascotas/admin/all');
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al obtener mascotas';
            return rejectWithValue(message);
        }
    }
);

export const createMascota = createAsyncThunk(
    'admin/createMascota',
    async (petData: Partial<Mascota>, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Mascota>>('/mascotas', petData);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al crear mascota';
            return rejectWithValue(message);
        }
    }
);

export const updateMascota = createAsyncThunk(
    'admin/updateMascota',
    async ({ id, data }: { id: number; data: Partial<Mascota> }, { rejectWithValue }) => {
        try {
            await api.put<ApiResponse<Mascota>>(`/mascotas/${id}`, data);
            return { id, ...data }; // Retornamos optimista o data si viniera
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al actualizar mascota';
            return rejectWithValue(message);
        }
    }
);

export const deleteMascota = createAsyncThunk(
    'admin/deleteMascota',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete<ApiResponse>(`/mascotas/${id}`);
            return id;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al eliminar mascota';
            return rejectWithValue(message);
        }
    }
);

// --- HISTORIAL ---

export const fetchHistorial = createAsyncThunk(
    'admin/fetchHistorial',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Historial[]>>('/historial/admin/all');
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al obtener historial';
            return rejectWithValue(message);
        }
    }
);

export const createHistorial = createAsyncThunk(
    'admin/createHistorial',
    async (histData: Partial<Historial>, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Historial>>('/historial', histData);
            return response.data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al crear historial';
            return rejectWithValue(message);
        }
    }
);

export const updateHistorial = createAsyncThunk(
    'admin/updateHistorial',
    async ({ id, data }: { id: number; data: Partial<Historial> }, { rejectWithValue }) => {
        try {
            await api.put<ApiResponse<Historial>>(`/historial/${id}`, data);
            return { id, ...data };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al actualizar historial';
            return rejectWithValue(message);
        }
    }
);

export const deleteHistorial = createAsyncThunk(
    'admin/deleteHistorial',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete<ApiResponse>(`/historial/${id}`);
            return id;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Error al eliminar historial';
            return rejectWithValue(message);
        }
    }
);

// SLICE
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        // FETCH OWNERS
        builder
            .addCase(fetchDuenos.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDuenos.fulfilled, (state, action) => {
                state.loading = false;
                state.owners = action.payload || [];
            })
            .addCase(fetchDuenos.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createDueno.pending, (state) => { state.loading = true; })
            .addCase(createDueno.fulfilled, (state, action) => {
                state.loading = false;
                state.owners.push(action.payload!);
                state.successMessage = 'Dueño creado exitosamente';
            })
            .addCase(createDueno.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(updateDueno.pending, (state) => { state.loading = true; })
            .addCase(updateDueno.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.owners.findIndex(o => o.id === action.payload!.id);
                if (index !== -1) {
                    state.owners[index] = action.payload!;
                }
                state.successMessage = 'Dueño actualizado exitosamente';
            })
            .addCase(updateDueno.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(deleteDueno.pending, (state) => { state.loading = true; })
            .addCase(deleteDueno.fulfilled, (state, action) => {
                state.loading = false;
                state.owners = state.owners.filter(o => o.id !== action.payload);
                state.successMessage = 'Dueño eliminado exitosamente';
            })
            .addCase(deleteDueno.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // --- MASCOTAS REDUCERS ---
        builder
            .addCase(fetchMascotas.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchMascotas.fulfilled, (state, action) => {
                state.loading = false;
                state.pets = action.payload || [];
            })
            .addCase(fetchMascotas.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createMascota.fulfilled, (state, action) => {
                state.loading = false;
                state.pets.push(action.payload!);
                state.successMessage = 'Mascota registrada exitosamente';
            })

            .addCase(updateMascota.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.pets.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.pets[index] = { ...state.pets[index], ...action.payload };
                }
                state.successMessage = 'Mascota actualizada exitosamente';
            })

            .addCase(deleteMascota.fulfilled, (state, action) => {
                state.loading = false;
                state.pets = state.pets.filter(p => p.id !== action.payload);
                state.successMessage = 'Mascota eliminada exitosamente';
            });

        // --- HISTORIAL REDUCERS ---
        builder
            .addCase(fetchHistorial.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchHistorial.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload || [];
            })
            .addCase(fetchHistorial.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

            .addCase(createHistorial.fulfilled, (state, action) => {
                state.loading = false;
                state.history.unshift(action.payload!); // Add to top
                state.successMessage = 'Registro médico creado exitosamente';
            })

            .addCase(updateHistorial.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.history.findIndex(h => h.id === action.payload.id);
                if (index !== -1) {
                    state.history[index] = { ...state.history[index], ...action.payload };
                }
                state.successMessage = 'Registro actualizado exitosamente';
            })

            .addCase(deleteHistorial.fulfilled, (state, action) => {
                state.loading = false;
                state.history = state.history.filter(h => h.id !== action.payload);
                state.successMessage = 'Registro eliminado exitosamente';
            });
    }
});

export const { clearMessages } = adminSlice.actions;
export default adminSlice.reducer;
