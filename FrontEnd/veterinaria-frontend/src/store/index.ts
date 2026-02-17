import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mascotasReducer from './slices/mascotasSlice';
import turnosReducer from './slices/turnosSlice';
import veterinariosReducer from './slices/veterinariosSlice';
import vetReducer from './slices/vetSlice';
import serviciosReducer from './slices/serviciosSlice';

// CONFIGURACION DEL STORE
export const store = configureStore({
    reducer: {
        auth: authReducer,
        mascotas: mascotasReducer,
        turnos: turnosReducer,
        veterinarios: veterinariosReducer,
        vet: vetReducer,
        servicios: serviciosReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
