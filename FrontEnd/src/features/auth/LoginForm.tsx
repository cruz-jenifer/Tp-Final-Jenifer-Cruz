import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { iniciarSesion, cerrarSesion } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import estilos from './LoginForm.module.css';

// FORMULARIO DE INICIO DE SESIÓN
export const LoginForm: React.FC = () => {
    const despacho = useDispatch<AppDispatch>();
    const navegar = useNavigate();
    const { cargando, error: errorRedux } = useSelector((state: RootState) => state.auth);
    const [tipoUsuario, setTipoUsuario] = React.useState<'dueno' | 'clinico'>('dueno');
    const [errorLocal, setErrorLocal] = React.useState<string | null>(null);

    const { valores, errores, manejarCambio, esValido } = useForm(
        { email: '', password: '' },
        {
            email: { required: true, email: true },
            password: { required: true, minLength: 5 },
        }
    );

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!esValido()) return;
        setErrorLocal(null);

        try {
            // AUTENTICACIÓN
            console.log('🔵 Iniciando Sesión...');
            const resultado = await despacho(iniciarSesion(valores)).unwrap();
            console.log('🟢 Inicio de Sesión Exitoso. Usuario:', resultado.usuario);

            if (resultado && resultado.usuario) {
                const rolUsuario = resultado.usuario.rol;

                // VERIFICACIÓN DE ROL
                let errorRol = false;

                if (tipoUsuario === 'dueno') {
                    if (rolUsuario !== 'cliente' && rolUsuario !== 'dueno' && rolUsuario !== 'admin') errorRol = true;
                } else {
                    if (rolUsuario !== 'admin' && rolUsuario !== 'veterinario') errorRol = true;
                }

                if (errorRol) {
                    console.warn('⚠️ Discrepancia de Rol:', rolUsuario, 'vs', tipoUsuario);
                    despacho(cerrarSesion());
                    setErrorLocal(`Esta cuenta no tiene permisos de ${tipoUsuario === 'dueno' ? 'Dueño' : 'Personal Clínico'}.`);
                    return;
                }

                // REDIRECCIONAMIENTO
                console.log('🚀 Redirigiendo según rol:', rolUsuario);
                switch (rolUsuario) {
                    case 'admin':
                        navegar('/admin');
                        break;
                    case 'veterinario':
                        navegar('/veterinario');
                        break;
                    case 'cliente':
                    case 'dueno':
                        navegar('/dashboard');
                        break;
                    default:
                        navegar('/');
                }
            }
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : String(error);
            console.error('❌ Error en Inicio de Sesión:', mensaje);
        }
    };

    return (
        <div className={estilos.loginContainer}>
            <div className={estilos.formWrapper}>
                {/* ENCABEZADO Y LOGO */}
                <div className={estilos.header}>
                    <span className={`material-icons ${estilos.logoIcon}`}>pets</span>
                    <h2 className={estilos.title}>¡Bienvenido de nuevo!</h2>
                    <p className={estilos.subtitle}>Ingresa a tu cuenta para continuar</p>
                </div>

                {/* INTERRUPTOR DE ROL */}
                <div className={estilos.toggleContainer}>
                    <button
                        type="button"
                        className={`${estilos.toggleButton} ${tipoUsuario === 'dueno' ? estilos.active : ''}`}
                        onClick={() => setTipoUsuario('dueno')}
                    >
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>pets</span>
                        SOY DUEÑO
                    </button>
                    <button
                        type="button"
                        className={`${estilos.toggleButton} ${tipoUsuario === 'clinico' ? estilos.active : ''}`}
                        onClick={() => setTipoUsuario('clinico')}
                    >
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>medical_services</span>
                        PERSONAL CLÍNICO
                    </button>
                </div>

                <form onSubmit={manejarEnvio}>
                    {/* CAMPO DE CORREO ELECTRÓNICO */}
                    <div className={estilos.inputGroup}>
                        <label htmlFor="email" className={estilos.label}>Correo Electrónico</label>
                        <div className={estilos.inputWrapper}>
                            <span className={`material-icons ${estilos.inputIcon}`}>email</span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={estilos.inputField}
                                value={valores.email}
                                onChange={manejarCambio}
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        {errores.email && <div className={estilos.errorMessage}>{errores.email}</div>}
                    </div>

                    {/* CAMPO DE CONTRASEÑA */}
                    <div className={estilos.inputGroup}>
                        <label htmlFor="password" className={estilos.label}>Contraseña</label>
                        <div className={estilos.inputWrapper}>
                            <span className={`material-icons ${estilos.inputIcon}`}>lock</span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={estilos.inputField}
                                value={valores.password}
                                onChange={manejarCambio}
                                placeholder="••••••••"
                            />
                        </div>
                        {errores.password && <div className={estilos.errorMessage}>{errores.password}</div>}
                    </div>

                    {/* RETROALIMENTACIÓN DE ERROR */}
                    {(errorRedux || errorLocal) && (
                        <div className="alert alert-danger text-center mb-4" role="alert">
                            {errorLocal || errorRedux}
                        </div>
                    )}

                    {/* BOTÓN DE ENVÍO */}
                    <button
                        type="submit"
                        className={estilos.submitButton}
                        disabled={cargando}
                    >
                        {cargando ? 'Cargando...' : 'INGRESAR'}
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>arrow_forward</span>
                    </button>
                </form>
            </div>

            <div className={estilos.footer}>
                © 2026 Patitas Felices Veterinaria. Todos los derechos reservados.
            </div>
        </div>
    );
};
