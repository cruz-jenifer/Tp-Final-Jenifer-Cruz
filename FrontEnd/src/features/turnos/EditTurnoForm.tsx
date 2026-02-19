import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { obtenerMascotas } from '../../store/slices/mascotasSlice';
import { obtenerServicios } from '../../store/slices/serviciosSlice';
import { fetchVeterinarios } from '../../store/slices/adminSlice';
import type { Turno } from '../../types/turno.types';
import type { Veterinario } from '../../store/slices/adminSlice';
import type { Servicio } from '../../store/slices/serviciosSlice';
import styles from './TurnoWizard.module.css';
import { SelectorHorario } from '../../components/ui/SelectorHorario';

interface DatosEdicionTurno {
    mascota_id: string;
    servicio_id: string;
    veterinario_id: string;
    fecha: string;
    hora: string;
    motivo_consulta: string;
}

interface EditTurnoFormProps {
    turno: Turno;
    onSubmit: (datos: DatosEdicionTurno) => void;
    onCancel: () => void;
}

export const EditTurnoForm: React.FC<EditTurnoFormProps> = ({ turno, onSubmit, onCancel }) => {
    const dispatch = useAppDispatch();
    const { mascotas } = useAppSelector((state) => state.mascotas);
    const servicios = useAppSelector((state) => state.servicios?.servicios ?? []);
    const veterinarios = useAppSelector((state) => state.admin.veterinarios ?? []);

    useEffect(() => {
        dispatch(obtenerMascotas());
        dispatch(obtenerServicios());
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    const fecha_inicial = turno.fecha || new Date().toISOString().split('T')[0];
    const hora_inicial = turno.hora || '09:00';

    const id_mascota_por_nombre = mascotas.find(m => m.nombre === turno.mascota)?.id;

    const [datos_formulario, setDatosFormulario] = useState({
        mascota_id: turno.mascota_id !== undefined && turno.mascota_id !== null
            ? turno.mascota_id.toString()
            : (id_mascota_por_nombre?.toString() || ''),
        servicio_id: turno.servicio_id?.toString() || '',
        veterinario_id: turno.veterinario_id?.toString() || '',
        fecha: fecha_inicial,
        hora: hora_inicial,
        motivo_consulta: turno.motivo_consulta || ''
    });

    const [mensaje_error, setMensajeError] = useState<string | null>(null);

    const obtenerManana = () => {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 1);
        return fecha.toISOString().split('T')[0];
    };

    const obtenerFechaMaxima = () => {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() + 3);
        return fecha.toISOString().split('T')[0];
    };

    const validarFecha = (valor_fecha: string) => {
        if (!valor_fecha) {
            setMensajeError(null);
            return false;
        }

        const [anio, mes, dia] = valor_fecha.split('-').map(Number);
        const fecha_seleccionada = new Date(anio, mes - 1, dia);

        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        manana.setHours(0, 0, 0, 0);

        const fecha_maxima = new Date();
        fecha_maxima.setMonth(fecha_maxima.getMonth() + 3);

        fecha_seleccionada.setHours(0, 0, 0, 0);

        if (fecha_seleccionada < manana) {
            setMensajeError('La fecha debe ser mañana o posterior.');
            return false;
        }

        if (fecha_seleccionada > fecha_maxima) {
            setMensajeError('La fecha no puede ser más de 3 meses en el futuro.');
            return false;
        }

        setMensajeError(null);
        return true;
    };

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDatosFormulario({
            ...datos_formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();

        if (!datos_formulario.mascota_id) {
            setMensajeError('Seleccione una mascota.');
            return;
        }

        if (!validarFecha(datos_formulario.fecha)) {
            return;
        }

        if (!datos_formulario.hora) {
            setMensajeError('Seleccione una hora.');
            return;
        }

        if (!datos_formulario.motivo_consulta) {
            setMensajeError('Ingrese un motivo.');
            return;
        }

        onSubmit(datos_formulario);
    };

    return (
        <form onSubmit={manejarEnvio} className={styles.wizardContainer}>
            <h3 style={{ marginBottom: '1rem' }}>Editar Turno</h3>

            {mensaje_error && (
                <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px', backgroundColor: '#fee2e2' }}>
                    {mensaje_error}
                </div>
            )}

            <div className={styles.content}>
                <div className={styles.stepContent}>
                    <label htmlFor="mascota_id">Mascota *</label>
                    <select
                        id="mascota_id"
                        name="mascota_id"
                        value={datos_formulario.mascota_id}
                        onChange={(e) => { manejarCambio(e); setMensajeError(null); }}
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
                        value={datos_formulario.fecha}
                        onChange={(e) => { manejarCambio(e); validarFecha(e.target.value); }}
                        className={styles.input}
                        min={obtenerManana()}
                        max={obtenerFechaMaxima()}
                        required
                    />
                </div>

                <div className={styles.stepContent}>
                    <SelectorHorario
                        name="hora"
                        value={datos_formulario.hora}
                        onChange={(e) => { manejarCambio(e); setMensajeError(null); }}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.stepContent}>
                    <label htmlFor="veterinario_id">Veterinario *</label>
                    <select
                        id="veterinario_id"
                        name="veterinario_id"
                        value={datos_formulario.veterinario_id}
                        onChange={manejarCambio}
                        className={styles.input}
                        required
                    >
                        <option value="">-- Seleccionar veterinario --</option>
                        {veterinarios.map((vet: Veterinario) => (
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
                        value={datos_formulario.servicio_id}
                        onChange={manejarCambio}
                        className={styles.input}
                        required
                    >
                        <option value="">-- Seleccionar servicio --</option>
                        {servicios.map((servicio: Servicio) => (
                            <option key={servicio.id} value={servicio.id}>
                                {servicio.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.stepContent}>
                    <label htmlFor="motivo_consulta">Motivo *</label>
                    <textarea
                        id="motivo_consulta"
                        name="motivo_consulta"
                        value={datos_formulario.motivo_consulta}
                        onChange={(e) => { manejarCambio(e); setMensajeError(null); }}
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
                    disabled={!!mensaje_error}
                    style={mensaje_error ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
};
