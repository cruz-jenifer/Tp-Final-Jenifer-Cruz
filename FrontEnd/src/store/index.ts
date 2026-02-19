import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mascotasReducer from './slices/mascotasSlice';
import turnosReducer from './slices/turnosSlice';
import vetReducer from './slices/vetSlice';
import serviciosReducer from './slices/serviciosSlice';
import adminReducer from './slices/adminSlice';

// CONFIGURACION DEL STORE
export const store = configureStore({
    reducer: {
        auth: authReducer,
        mascotas: mascotasReducer,
        turnos: turnosReducer,
        vet: vetReducer,
        servicios: serviciosReducer,
        admin: adminReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
