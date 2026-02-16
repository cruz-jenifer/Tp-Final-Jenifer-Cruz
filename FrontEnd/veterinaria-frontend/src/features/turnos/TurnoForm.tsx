import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMascotas } from '../../store/slices/mascotasSlice';
import { createTurno } from '../../store/slices/turnosSlice';
import styles from './TurnoForm.module.css';

interface TurnoFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const TurnoForm: React.FC<TurnoFormProps> = ({ onSuccess, onCancel }) => {
    const dispatch = useAppDispatch();
    const { mascotas } = useAppSelector((state) => state.mascotas);
    const formRef = useRef<HTMLFormElement>(null);
    const firstInputRef = useRef<HTMLSelectElement>(null);

    const [formData, setFormData] = useState({
        mascota_id: '',
        veterinario_id: '',
        fecha: '',
        hora: '',
        motivo: ''
    });

    useEffect(() => {
        dispatch(fetchMascotas());
        // SCROLL AL PRIMER INPUT AL MONTAR
        if (firstInputRef.current) {
            firstInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInputRef.current.focus();
        }
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDACION BASICA
        if (!formData.mascota_id || !formData.fecha || !formData.hora || !formData.motivo) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        const fecha_hora = `${formData.fecha} ${formData.hora}:00`;

        // MOCKEAR IDS DE SERVICIO/VETERINARIO SI NO SE SELECCIONAN (O SI NO TENEMOS ENDPOINTS PARA ELLOS TODAVIA)
        // POR AHORA, ASUMIMOS ID 1 VALIDO PARA VETERINARIO SI ESTA VACIO
        const turnoData = {
            mascota_id: Number(formData.mascota_id),
            veterinario_id: Number(formData.veterinario_id) || 1, // ID POR DEFECTO/MOCK
            servicio_id: 1, // ID POR DEFECTO/MOCK
            fecha_hora,
            motivo: formData.motivo,
            estado: 'pendiente' as const
        };

        try {
            await dispatch(createTurno(turnoData)).unwrap();
            alert('Turno creado exitosamente');
            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error al crear turno: ' + error);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
            <div className={styles.formGroup}>
                <label htmlFor="mascota_id">Mascota *</label>
                <select
                    id="mascota_id"
                    name="mascota_id"
                    value={formData.mascota_id}
                    onChange={handleChange}
                    ref={firstInputRef}
                    required
                    className={styles.input}
                >
                    <option value="">Seleccione una mascota</option>
                    {mascotas.map(pet => (
                        <option key={pet.id} value={pet.id}>
                            {pet.nombre} ({pet.especie})
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label htmlFor="fecha">Fecha *</label>
                    <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="hora">Hora *</label>
                    <input
                        type="time"
                        id="hora"
                        name="hora"
                        value={formData.hora}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="veterinario_id">Veterinario (Opcional)</label>
                <select
                    id="veterinario_id"
                    name="veterinario_id"
                    value={formData.veterinario_id}
                    onChange={handleChange}
                    className={styles.input}
                >
                    <option value="">Cualquiera disponible</option>
                    <option value="1">Dr. House (General)</option>
                    <option value="2">Dra. Polo (Cirugía)</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="motivo">Motivo de consulta *</label>
                <textarea
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={styles.textarea}
                    placeholder="Describe brevemente la razón de la visita..."
                />
            </div>

            <div className={styles.actions}>
                {onCancel && (
                    <button type="button" onClick={onCancel} className={styles.cancelButton}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className={styles.submitButton}>
                    Confirmar Turno
                </button>
            </div>
        </form>
    );
};
