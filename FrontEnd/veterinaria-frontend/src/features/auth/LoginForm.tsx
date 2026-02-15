import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { Input } from '../../components/ui/Input';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import styles from './LoginForm.module.css';

// FORMULARIO DE INICIO DE SESION
export const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);

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

        dispatch(loginStart());

        try {
            // AUTENTICACION CON SERVIDOR
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (values.email === 'admin@admin.com' && values.password === '12345') {
                dispatch(loginSuccess({
                    user: { id: 1, email: values.email, role: 'admin', nombre: 'Admin' },
                    token: 'jwt-token-demo'
                }));
                navigate('/');
            } else {
                throw new Error('Credenciales inválidas');
            }
        } catch (err: any) {
            dispatch(loginFailure(err.message || 'Error al iniciar sesión'));
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.formWrapper}>
                <h2 className={styles.title}>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="ejemplo@email.com"
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Contraseña"
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="Mínimo 5 caracteres"
                    />

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};
