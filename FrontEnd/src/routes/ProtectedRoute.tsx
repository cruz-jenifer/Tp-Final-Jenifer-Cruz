import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// PROPIEDADES DE LA RUTA PROTEGIDA
interface ProtectedRouteProps {
    allowedRoles?: string[];
}

// COMPONENTE DE PROTECCION DE RUTAS
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { estaAutenticado, usuario, token } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    // REGISTRO DE ESTADO PARA DEPURACION
    console.log('--- VERIFICANDO GUARDIA ---');
    console.log('ESTA AUTENTICADO:', estaAutenticado);
    console.log('TOKEN PRESENTE:', !!token);
    console.log('ROL USUARIO:', usuario?.rol);

    // VERIFICACION ESTRICTA DE AUTENTICACION
    if (!estaAutenticado || !usuario || !token) {
        console.warn('ACCESO DENEGADO: USUARIO NO AUTENTICADO O DATOS INCOMPLETOS');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // VERIFICACION ESTRICTA DE ROLES
    if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
        console.warn('ACCESO DENEGADO: EL ROL NO TIENE PERMISOS PARA ESTA RUTA');

        // REDIRECCION SEGUN EL ROL QUE TENGA
        if (usuario.rol === 'admin') return <Navigate to="/admin" replace />;
        if (usuario.rol === 'veterinario') return <Navigate to="/veterinario" replace />;
        if (usuario.rol === 'cliente' || usuario.rol === 'dueno') return <Navigate to="/dashboard" replace />;

        return <Navigate to="/" replace />;
    }

    // SI TODO ES CORRECTO, RENDERIZAR CONTENIDO
    return <Outlet />;
};
