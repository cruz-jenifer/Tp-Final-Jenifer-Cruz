import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { loginUser, logout } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import styles from './LoginForm.module.css';

// FORMULARIO DE INICIO DE SESION
export const LoginForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error: reduxError } = useSelector((state: RootState) => state.auth);
    const [userType, setUserType] = React.useState<'dueno' | 'clinico'>('dueno');
    const [localError, setLocalError] = React.useState<string | null>(null);

    const { values, errors, handleChange, isValid } = useForm(
        { email: '', password: '' },
        {
            email: { required: true, email: true },
            password: { required: true, minLength: 5 },
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid()) return;
        setLocalError(null);

        try {
            // AUTENTICACION CON BACKEND
            const result = await dispatch(loginUser(values)).unwrap();

            if (result && result.user) {
                const userRole = result.user.rol;
                // VERIFICACION DE ROL DEL USUARIO

                let roleMismatch = false;

                if (userType === 'dueno') {
                    // VALIDACION DE ROL CLIENTE
                    if (userRole !== 'cliente') roleMismatch = true;
                } else {
                    if (userRole !== 'admin' && userRole !== 'veterinario') roleMismatch = true;
                }

                if (roleMismatch) {
                    // DISCREPANCIA DETECTADA
                    dispatch(logout()); // LIMPIEZA DE SESION
                    setLocalError(`Esta cuenta no tiene permisos de ${userType === 'dueno' ? 'Dueño' : 'Personal Clínico'}.`);
                    return;
                }

                // SI TODO OK
                if (userRole === 'veterinario') {
                    navigate('/veterinario');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err: unknown) {
            console.error('Login failed:', err);
            // ERROR DE INICIO DE SESION
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.formWrapper}>
                {/* ENCABEZADO Y LOGO */}
                <div className={styles.header}>
                    <span className={`material-icons ${styles.logoIcon}`}>pets</span>
                    <h2 className={styles.title}>¡Bienvenido de nuevo!</h2>
                    <p className={styles.subtitle}>Ingresa a tu cuenta para continuar</p>
                </div>

                {/* INTERRUPTOR */}
                <div className={styles.toggleContainer}>
                    <button
                        type="button"
                        className={`${styles.toggleButton} ${userType === 'dueno' ? styles.active : ''}`}
                        onClick={() => setUserType('dueno')}
                    >
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>pets</span>
                        SOY DUEÑO
                    </button>
                    <button
                        type="button"
                        className={`${styles.toggleButton} ${userType === 'clinico' ? styles.active : ''}`}
                        onClick={() => setUserType('clinico')}
                    >
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>medical_services</span>
                        PERSONAL CLÍNICO
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* CAMPO DE CORREO ELECTRONICO */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                        <div className={styles.inputWrapper}>
                            <span className={`material-icons ${styles.inputIcon}`}>email</span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={styles.inputField}
                                value={values.email}
                                onChange={handleChange}
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
                    </div>

                    {/* CAMPO DE CONTRASEÑA */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <div className={styles.inputWrapper}>
                            <span className={`material-icons ${styles.inputIcon}`}>lock</span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={styles.inputField}
                                value={values.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
                    </div>



                    {/* RETROALIMENTACION DE ERROR */}
                    {(reduxError || localError) && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm text-center">
                            {localError || reduxError}
                        </div>
                    )}

                    {/* BOTON DE ENVIO */}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'INGRESAR'}
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>arrow_forward</span>
                    </button>
                </form>
            </div>

            <div className={styles.footer}>
                © 2026 Patitas Felices Veterinaria. Todos los derechos reservados.
            </div>
        </div>
    );
};
