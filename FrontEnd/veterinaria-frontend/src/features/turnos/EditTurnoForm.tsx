import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchMascotas } from '../../store/slices/mascotasSlice';
import { fetchServicios } from '../../store/slices/serviciosSlice';
import { fetchVeterinarios } from '../../store/slices/veterinariosSlice';
import type { Turno } from '../../types/turno.types';
import styles from './TurnoWizard.module.css';

interface EditTurnoFormProps {
    turno: Turno;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export const EditTurnoForm: React.FC<EditTurnoFormProps> = ({ turno, onSubmit, onCancel }) => {
    const dispatch = useAppDispatch();
    const { mascotas } = useAppSelector((state) => state.mascotas);
    const servicios = useAppSelector((state) => state.servicios?.servicios ?? []);
    const veterinarios = useAppSelector((state) => state.veterinarios?.veterinarios ?? []);

    useEffect(() => {
        dispatch(fetchMascotas());
        dispatch(fetchServicios());
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    // EXTRAER FECHA Y HORA DEL TURNO EXISTENTE
    // PARSEO SEGURO DE FECHA Y HORA
    const parseFechaHora = (fechaHoraStr: string) => {
        try {
            // CONVERSION A OBJETO DATE
            const date = new Date(fechaHoraStr.replace(' ', 'T'));

            // OBTENCION DE FECHA Y HORA LOCAL
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return {
                fecha: `${year}-${month}-${day}`,
                hora: `${hours}:${minutes}`,
                date
            };
        } catch (error) {
            console.error('Error parsing fecha_hora:', error);
            return {
                fecha: new Date().toISOString().split('T')[0],
                hora: '09:00',
                date: new Date()
            };
        }
    };

    const { fecha: fechaInicial, hora: horaInicial } = parseFechaHora(turno.fecha_hora);

    // BUSQUEDA DE ID DE MASCOTA POR NOMBRE
    const mascotaIdFromNombre = mascotas.find(m => m.nombre === turno.mascota)?.id;

    const [formData, setFormData] = useState({
        mascota_id: turno.mascota_id !== undefined && turno.mascota_id !== null
            ? turno.mascota_id.toString()
            : (mascotaIdFromNombre?.toString() || ''),
        servicio_id: turno.servicio_id?.toString() || '',
        veterinario_id: turno.veterinario_id?.toString() || '',
        fecha: fechaInicial,
        hora: horaInicial,
        motivo: turno.motivo || '' // MOTIVO DEL TURNO
    });

    const [error, setError] = useState<string | null>(null);

    const MIN_HOUR = 8;
    const MAX_HOUR = 17;

    const getTomorrow = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getMaxDate = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 3);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const generateTimeOptions = () => {
        const options = [];
        for (let i = MIN_HOUR; i < MAX_HOUR; i++) {
            options.push(`${i.toString().padStart(2, '0')}:00`);
            options.push(`${i.toString().padStart(2, '0')}:30`);
        }

        // AGREGAR HORA ACTUAL SI ESTA FUERA DE RANGO
        const parsedHora = parseFechaHora(turno.fecha_hora).hora;
        if (parsedHora && !options.includes(parsedHora)) {
            options.push(parsedHora);
            options.sort(); // ORDENAR OPCIONES
        }

        return options;
    };

    const validateDate = (dateValue: string) => {
        if (!dateValue) {
            setError(null);
            return false;
        }

        // PARSEO DE CADENA DE FECHA A FECHA LOCAL
        const [year, month, day] = dateValue.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day); // MEDIANOCHE LOCAL

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // MEDIANOCHE LOCAL MAÑANA

        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        maxDate.setHours(23, 59, 59, 999);

        // NORMALIZACION PARA COMPARACION
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < tomorrow) {
            setError('La fecha debe ser mañana o posterior.');
            return false;
        }

        if (selectedDate > maxDate) {
            setError('La fecha no puede ser más de 3 meses en el futuro.');
            return false;
        }

        setError(null);
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.mascota_id) {
            setError('Seleccione una mascota.');
            return;
        }

        if (!validateDate(formData.fecha)) {
            return;
        }

        if (!formData.hora) {
            setError('Seleccione una hora.');
            return;
        }

        const [hour, minute] = formData.hora.split(':').map(Number);
        if (hour < MIN_HOUR || hour >= MAX_HOUR) {
            setError(`El horario de atención es de ${MIN_HOUR}:00 a ${MAX_HOUR}:00.`);
            return;
        }
        if (minute !== 0 && minute !== 30) {
            setError('Los turnos son cada 30 minutos (ej. 10:00, 10:30).');
            return;
        }

        if (!formData.motivo) {
            setError('Ingrese un motivo.');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.wizardContainer}>
            <h3 style={{ marginBottom: '1rem' }}>Editar Turno</h3>

            {error && (
                <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px', backgroundColor: '#fee2e2' }}>
                    {error}
                </div>
            )}

            <div className={styles.content}>
                <div className={styles.stepContent}>
                    <label htmlFor="mascota_id">Mascota *</label>
                    <select
                        id="mascota_id"
                        name="mascota_id"
                        value={formData.mascota_id}
                        onChange={(e) => { handleChange(e); setError(null); }}
                        className={styles.input}
                        required
                    >
                        <option value="">-- Seleccionar --</option>
                        {mascotas.map(pet => (
                            <option key={pet.id} value={pet.id}>
                                {pet.nombre} ({pet.especie})
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.stepContent}>
                    <label>Fecha *</label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={(e) => { handleChange(e); validateDate(e.target.value); }}
                        className={styles.input}
                        min={getTomorrow()}
                        max={getMaxDate()}
                        required
                    />
                </div>

                <div className={styles.stepContent}>
                    <label>Hora *</label>
                    <select
                        name="hora"
                        value={formData.hora}
                        onChange={(e) => { handleChange(e); setError(null); }}
                        className={styles.input}
                        required
                    >
                        <option value="">-- Hora --</option>
                        {generateTimeOptions().map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.stepContent}>
                    <label htmlFor="veterinario_id">Veterinario *</label>
                    <select
                        id="veterinario_id"
                        name="veterinario_id"
                        value={formData.veterinario_id}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    >
                        <option value="">-- Seleccionar veterinario --</option>
                        {veterinarios.map((vet: any) => (
                            <option key={vet.id} value={vet.id}>
                                {vet.nombre} {vet.apellido}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.stepContent}>
                    <label htmlFor="servicio_id">Servicio *</label>
                    <select
                        id="servicio_id"
                        name="servicio_id"
                        value={formData.servicio_id}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    >
                        <option value="">-- Seleccionar servicio --</option>
                        {servicios.map((servicio: any) => (
                            <option key={servicio.id} value={servicio.id}>
                                {servicio.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.stepContent}>
                    <label htmlFor="motivo">Motivo *</label>
                    <textarea
                        id="motivo"
                        name="motivo"
                        value={formData.motivo}
                        onChange={(e) => { handleChange(e); setError(null); }}
                        className={styles.textarea}
                        rows={3}
                        required
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <button type="button" onClick={onCancel} className={styles.secondaryButton}>
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={!!error}
                    style={error ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
};
