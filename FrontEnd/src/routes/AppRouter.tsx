import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// CARGA PEREZOSA DE COMPONENTES DE PORTAL
const LandingPage = lazy(() => import('../features/public/LandingPage').then(module => ({ default: module.LandingPage })));
const LoginForm = lazy(() => import('../features/auth/LoginForm').then(module => ({ default: module.LoginForm })));
const ClientDashboard = lazy(() => import('../features/client/ClientDashboard'));
const VetDashboard = lazy(() => import('../features/vet/VetDashboard').then(module => ({ default: module.VetDashboard })));
const AdminLayout = lazy(() => import('../features/admin/layout/AdminLayout').then(module => ({ default: module.AdminLayout })));

// ENRUTADOR PRINCIPAL DE LA APLICACION
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
                    {/* RUTA PUBLICA DE INICIO */}
                    <Route path="/" element={<LandingPage />} />

                    {/* FORMULARIO DE ACCESO */}
                    <Route path="/login" element={<LoginForm />} />

                    {/* RUTAS PROTEGIDAS PARA CLIENTES Y DUEÑOS */}
                    <Route element={<ProtectedRoute allowedRoles={['cliente', 'dueno']} />}>
                        <Route path="/dashboard" element={<ClientDashboard />} />
                    </Route>

                    {/* RUTAS PROTEGIDAS PARA VETERINARIOS */}
                    <Route element={<ProtectedRoute allowedRoles={['veterinario']} />}>
                        <Route path="/veterinario" element={<VetDashboard />} />
                    </Route>

                    {/* RUTAS PROTEGIDAS PARA ADMINISTRADORES */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/*" element={<AdminLayout />} />
                    </Route>

                    {/* CAPTURA DE RUTAS NO DEFINIDAS */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
