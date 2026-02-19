import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

// RUTA PROTEGIDA CON VERIFICACION DE ROLES
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { estaAutenticado, usuario } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!estaAutenticado) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && usuario && !allowedRoles.includes(usuario.rol)) {
        // SI EL USUARIO NO TIENE EL ROL ADECUADO, REDIRIGIR A SU DASHBOARD
        if (usuario.rol === 'admin') return <Navigate to="/admin" replace />;
        if (usuario.rol === 'veterinario') return <Navigate to="/veterinario" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
