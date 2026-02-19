import React from 'react';
import styles from './AppointmentsPage.module.css';
import { useAppointmentForm } from '../hooks/useAppointmentForm';
import { SelectorHorario } from '../../../components/ui/SelectorHorario';

interface FormularioTurnosProps {
    turnoAEditar?: any;
    alCancelarEdicion: () => void;
    alTenerExito: () => void;
}

export const FormularioTurnos: React.FC<FormularioTurnosProps> = ({
    turnoAEditar,
    alCancelarEdicion,
    alTenerExito
}) => {
    const {
        formData, errors, checkingAvailability, isEditing,
        handleChange, handleSubmit, duenos, mascotas, veterinarios, es_valido
    } = useAppointmentForm(turnoAEditar, alTenerExito);

    return (
        <div className={styles.formCard} style={{ borderLeft: isEditing ? '4px solid #6384FF' : 'none' }}>
            <h3 className={styles.formTitle}>
                <span className="material-symbols-outlined">{isEditing ? 'edit_calendar' : 'event_available'}</span>
                {isEditing ? 'Editar Turno' : 'Programar Nuevo Turno'}
            </h3>

            <form onSubmit={handleSubmit}>
                <div className={styles.grid}>
                    {!isEditing && (
                        <div className={`${styles.inputGroup} ${styles.span2}`}>
                            <label>ID Dueño</label>
                            <input
                                name="dueno_id"
                                value={formData.dueno_id}
                                onChange={handleChange}
                                type="text"
                                list="ownersList"
                                className={`${styles.inputField} ${errors.dueno_id ? styles.inputError : ''}`}
                                placeholder="#DW-..."
                                autoComplete="off"
                            />
                            <datalist id="ownersList">
                                {duenos.map(o => (
                                    <option key={o.id} value={o.id}>{o.nombre} {o.apellido} (DNI: {o.dni || 'N/A'})</option>
                                ))}
                            </datalist>
                            {errors.dueno_id && <span className={styles.errorText}>{errors.dueno_id}</span>}
                        </div>
                    )}
                    <div className={`${styles.inputGroup} ${styles.span2}`}>
                        <label>ID Mascota</label>
                        <input
                            name="mascota_id"
                            value={formData.mascota_id}
                            onChange={handleChange}
                            type="text"
                            list="petsList"
                            className={`${styles.inputField} ${errors.mascota_id ? styles.inputError : ''}`}
                            placeholder="#PET-..."
                            autoComplete="off"
                        />
                        <datalist id="petsList">
                            {mascotas
                                .filter(p => !formData.dueno_id || p.dueno_id === Number(formData.dueno_id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} ({p.especie})</option>
                                ))}
                        </datalist>
                        {errors.mascota_id && <span className={styles.errorText}>{errors.mascota_id}</span>}
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span3}`}>
                        <label>Tipo de Servicio</label>
                        <select name="servicio_id" value={formData.servicio_id} onChange={handleChange} className={styles.inputField}>
                            <option value="1">Consulta General</option>
                            <option value="2">Vacunación</option>
                            <option value="3">Desparasitación</option>
                        </select>
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span3}`}>
                        <label>Seleccionar Veterinario *</label>
                        <select
                            name="veterinario_id"
                            value={formData.veterinario_id}
                            onChange={handleChange}
                            className={`${styles.inputField} ${errors.veterinario_id ? styles.inputError : ''}`}
                        >
                            <option value="">Seleccione un profesional</option>
                            {veterinarios.map(v => (
                                <option key={v.id} value={v.id}>
                                    Dr/a. {v.nombre} {v.apellido} ({v.matricula || 'Sin mat.'})
                                </option>
                            ))}
                        </select>
                        {errors.veterinario_id && <span className={styles.errorText}>{errors.veterinario_id}</span>}
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span2}`}>
                        <label>Fecha</label>
                        <input
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            type="date"
                            className={`${styles.inputField} ${errors.fecha ? styles.inputError : ''}`}
                        />
                        {errors.fecha && <span className={styles.errorText}>{errors.fecha}</span>}
                    </div>

                    <div className={`${styles.inputGroup} ${styles.span2}`}>
                        <SelectorHorario
                            name="hora"
                            value={formData.hora}
                            onChange={(hora) => handleChange({ target: { name: 'hora', value: hora } } as any)}
                            fecha={formData.fecha}
                            veterinarioId={Number(formData.veterinario_id)}
                            error={errors.hora}
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={alCancelarEdicion}
                        className={styles.btnSecondary}
                    >
                        {isEditing ? 'Cancelar' : 'Limpiar'}
                    </button>
                    <button
                        type="submit"
                        disabled={!es_valido || checkingAvailability}
                        className={styles.btnPrimary}
                    >
                        {isEditing ? 'Actualizar Cita' : 'Programar Cita'}
                    </button>
                </div>
            </form>
        </div>
    );
};
