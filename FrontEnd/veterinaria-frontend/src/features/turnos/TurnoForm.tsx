import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMascotas } from '../../store/slices/mascotasSlice';
import { createTurno } from '../../store/slices/turnosSlice';
import styles from './TurnoForm.module.css';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

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
            <Select
                id="mascota_id"
                name="mascota_id"
                label="Mascota *"
                value={formData.mascota_id}
                onChange={handleChange}
                ref={firstInputRef}
                required
            >
                <option value="">Seleccione una mascota</option>
                {mascotas.map(pet => (
                    <option key={pet.id} value={pet.id}>
                        {pet.nombre} ({pet.especie})
                    </option>
                ))}
            </Select>

            <div className={styles.row}>
                <div style={{ flex: 1 }}>
                    <Input
                        label="Fecha *"
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <Input
                        label="Hora *"
                        type="time"
                        id="hora"
                        name="hora"
                        value={formData.hora}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <Select
                id="veterinario_id"
                name="veterinario_id"
                label="Veterinario (Opcional)"
                value={formData.veterinario_id}
                onChange={handleChange}
            >
                <option value="">Cualquiera disponible</option>
                <option value="1">Dr. House (General)</option>
                <option value="2">Dra. Polo (Cirugía)</option>
            </Select>

            <Textarea
                id="motivo"
                name="motivo"
                label="Motivo de consulta *"
                value={formData.motivo}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe brevemente la razón de la visita..."
            />

            <div className={styles.actions}>
                {onCancel && (
                    <Button type="button" onClick={onCancel} variant="secondary">
                        Cancelar
                    </Button>
                )}
                <Button type="submit" variant="primary">
                    Confirmar Turno
                </Button>
            </div>
        </form>
    );
};
