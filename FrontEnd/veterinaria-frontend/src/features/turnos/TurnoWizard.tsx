import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTurno, fetchMisTurnos } from '../../store/slices/turnosSlice';
import { fetchMascotas } from '../../store/slices/mascotasSlice';
import { fetchVeterinarios } from '../../store/slices/veterinariosSlice';
import { fetchServicios } from '../../store/slices/serviciosSlice';
import styles from './TurnoWizard.module.css';
import type { Servicio } from '../../store/slices/serviciosSlice';
import type { Veterinario } from '../../store/slices/veterinariosSlice';

interface TurnoWizardProps {
    onClose: () => void;
}

export const TurnoWizard: React.FC<TurnoWizardProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const { mascotas } = useAppSelector((state) => state.mascotas);
    const { veterinarios } = useAppSelector((state) => state.veterinarios);
    const servicios = useAppSelector((state) => state.servicios?.servicios ?? []);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        mascota_id: '',
        servicio_id: '',
        veterinario_id: '',
        fecha: '',
        hora: '',
        motivo: ''
    });

    React.useEffect(() => {
        dispatch(fetchMascotas());
        dispatch(fetchVeterinarios());
        dispatch(fetchServicios());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // CONSTANTES DE VALIDACION
    const MIN_HOUR = 8;
    const MAX_HOUR = 17;

    // AYUDANTES DE FECHA
    const getTomorrow = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 3);
        return date.toISOString().split('T')[0];
    };

    // ESTADO DE ERRORES POR CAMPO
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    // ERROR GENERAL PARA FALLOS DE SERVIDOR
    const [generalError, setGeneralError] = useState<string | null>(null);

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.mascota_id) newErrors.mascota_id = 'Por favor seleccione una mascota.';
        if (!formData.servicio_id) newErrors.servicio_id = 'Por favor seleccione un servicio.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.fecha) {
            newErrors.fecha = 'Seleccione una fecha.';
        } else {
            // VALIDAR FECHA LOGICA

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            maxDate.setHours(23, 59, 59, 999);

            // CORRECCION DE ZONA HORARIA Y LOGICA DE VALIDACION
            const [y, m, d] = formData.fecha.split('-').map(Number);
            const localSelected = new Date(y, m - 1, d); // MES ES 0-INDEX

            if (localSelected < new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())) {
                newErrors.fecha = 'La fecha debe ser mañana o posterior.';
            } else if (localSelected > maxDate) {
                newErrors.fecha = 'La fecha no puede ser más de 3 meses en el futuro.';
            }
        }

        if (!formData.hora) {
            newErrors.hora = 'Seleccione una hora.';
        } else {
            const [hour] = formData.hora.split(':').map(Number);
            if (hour < MIN_HOUR || hour >= MAX_HOUR) {
                newErrors.hora = `Horario: ${MIN_HOUR}:00 a ${MAX_HOUR}:00.`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        setGeneralError(null);
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep(step + 1);
    };

    const handleBack = () => {
        setGeneralError(null);
        setErrors({});
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        if (!formData.motivo) {
            setErrors({ motivo: 'Por favor ingrese un motivo de consulta.' });
            return;
        }

        const turnoData = {
            mascota_id: Number(formData.mascota_id),
            veterinario_id: Number(formData.veterinario_id) || undefined,
            servicio_id: Number(formData.servicio_id),
            fecha_hora: `${formData.fecha} ${formData.hora}:00`,
            motivo: formData.motivo,
            estado: 'pendiente' as const
        };

        try {
            await dispatch(createTurno(turnoData)).unwrap();
            await dispatch(fetchMisTurnos());
            onClose();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            setGeneralError('Error al crear turno: ' + message);
        }
    };

    // GENERAR OPCIONES DE HORA
    const generateTimeOptions = () => {
        const options = [];
        for (let i = MIN_HOUR; i < MAX_HOUR; i++) {
            options.push(`${i.toString().padStart(2, '0')}:00`);
            options.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return options;
    };

    return (
        <div className={styles.wizardContainer}>
            {/* INDICADOR DE PROGRESO */}
            <div className={styles.progress}>
                <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1</div>
                <div className={styles.line}></div>
                <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2</div>
                <div className={styles.line}></div>
                <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3</div>
            </div>

            {generalError && (
                <div className={styles.errorText} style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {generalError}
                </div>
            )}

            <div className={styles.content}>
                {step === 1 && (
                    <div className={styles.stepContent}>
                        <h3>Selecciona tu Mascota</h3>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Mascota *</label>
                            <select
                                name="mascota_id"
                                value={formData.mascota_id}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (errors.mascota_id) setErrors({ ...errors, mascota_id: '' });
                                }}
                                className={`${styles.input} ${errors.mascota_id ? styles.inputError : ''}`}
                            >
                                <option value="">-- Seleccionar --</option>
                                {mascotas.map(pet => (
                                    <option key={pet.id} value={pet.id}>
                                        {pet.nombre} ({pet.especie})
                                    </option>
                                ))}
                            </select>
                            {errors.mascota_id && <span className={styles.errorText}>{errors.mascota_id}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Servicio *</label>
                            <select
                                name="servicio_id"
                                value={formData.servicio_id}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (errors.servicio_id) setErrors({ ...errors, servicio_id: '' });
                                }}
                                className={`${styles.input} ${errors.servicio_id ? styles.inputError : ''}`}
                            >
                                <option value="">-- Seleccionar --</option>
                                {servicios.map((servicio: Servicio) => (
                                    <option key={servicio.id} value={servicio.id}>
                                        {servicio.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.servicio_id && <span className={styles.errorText}>{errors.servicio_id}</span>}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <h3>Fecha y Hora</h3>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Fecha *</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (errors.fecha) setErrors({ ...errors, fecha: '' });
                                    }}
                                    className={`${styles.input} ${errors.fecha ? styles.inputError : ''}`}
                                    min={getTomorrow()}
                                    max={getMaxDate()}
                                />
                                {errors.fecha && <span className={styles.errorText}>{errors.fecha}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Hora *</label>
                                <select
                                    name="hora"
                                    value={formData.hora}
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (errors.hora) setErrors({ ...errors, hora: '' });
                                    }}
                                    className={`${styles.input} ${errors.hora ? styles.inputError : ''}`}
                                >
                                    <option value="">-- : --</option>
                                    {generateTimeOptions().map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                {errors.hora && <span className={styles.errorText}>{errors.hora}</span>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Veterinario (Opcional)</label>
                            <select
                                name="veterinario_id"
                                value={formData.veterinario_id}
                                onChange={handleChange}
                                className={styles.input}
                            >
                                <option value="">Cualquiera</option>
                                {veterinarios.map((vet) => (
                                    <option key={vet.id} value={vet.id}>
                                        {vet.nombre} {vet.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.stepContent}>
                        <h3>Confirmación</h3>

                        <div className={styles.confirmationBox}>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Mascota</span>
                                <span className={styles.summaryValue}>{mascotas.find(m => m.id === Number(formData.mascota_id))?.nombre}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Servicio</span>
                                <span className={styles.summaryValue}>{servicios.find((s: Servicio) => s.id === Number(formData.servicio_id))?.nombre || 'No seleccionado'}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Veterinario</span>
                                <span className={styles.summaryValue}>{
                                    formData.veterinario_id
                                        ? (() => { const vet = veterinarios.find((v: Veterinario) => v.id === Number(formData.veterinario_id)); return vet ? `${vet.nombre} ${vet.apellido}` : 'No encontrado'; })()
                                        : 'Cualquiera'
                                }</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Fecha y Hora</span>
                                <span className={styles.summaryValue}>{formData.fecha} a las {formData.hora}</span>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Motivo de consulta *</label>
                            <textarea
                                name="motivo"
                                value={formData.motivo}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (errors.motivo) setErrors({ ...errors, motivo: '' });
                                }}
                                className={`${styles.textarea} ${errors.motivo ? styles.inputError : ''}`}
                                placeholder="Describa brevemente el motivo de la consulta..."
                            />
                            {errors.motivo && <span className={styles.errorText}>{errors.motivo}</span>}
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                {step > 1 && (
                    <button onClick={handleBack} className={styles.secondaryButton}>Atrás</button>
                )}
                {step < 3 ? (
                    <button
                        onClick={handleNext}
                        className={styles.primaryButton}
                    >
                        Siguiente
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className={styles.primaryButton}
                    >
                        Confirmar Turno
                    </button>
                )}
            </div>
        </div>
    );
};
