import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// CARGA PEREZOSA DE COMPONENTES
const LandingPage = lazy(() => import('../features/public/LandingPage').then(module => ({ default: module.LandingPage })));
const LoginForm = lazy(() => import('../features/auth/LoginForm').then(module => ({ default: module.LoginForm })));
const ClientDashboard = lazy(() => import('../features/client/ClientDashboard'));
const VetDashboard = lazy(() => import('../features/vet/VetDashboard').then(module => ({ default: module.VetDashboard })));
const AdminLayout = lazy(() => import('../features/admin/layout/AdminLayout').then(module => ({ default: module.AdminLayout })));
const ProtectedRoute = lazy(() => import('./ProtectedRoute').then(module => ({ default: module.ProtectedRoute })));

// ENRUTADOR PRINCIPAL
export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">CARGANDO...</span>
                    </div>
                </div>
            }>
                <Routes>
                    {/* RUTA PUBLICA */}
                    <Route path="/" element={<LandingPage />} />

                    {/* LOGIN */}
                    <Route path="/login" element={<LoginForm />} />

                    {/* RUTAS PROTEGIDAS */}
                    <Route element={<ProtectedRoute allowedRoles={['cliente', 'dueno']} />}>
                        <Route path="/dashboard" element={<ClientDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['veterinario']} />}>
                        <Route path="/veterinario" element={<VetDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/*" element={<AdminLayout />} />
                    </Route>

                    {/* REDIRECCION POR DEFECTO */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
