import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { createTurno, updateTurno, checkAvailability, fetchAgendaAdmin } from '../../../store/slices/turnosSlice';
import type { Turno } from '../../../types/turno.types';
import { isRequired, hasErrors } from '../../../utils/validators';

interface AppointmentFormData {
    dueno_id: string;
    mascota_id: string;
    veterinario_id: string;
    servicio_id: string;
    fecha: string;
    hora: string;
    motivo: string;
}

const INITIAL_STATE: AppointmentFormData = {
    dueno_id: '',
    mascota_id: '',
    veterinario_id: '',
    servicio_id: '1',
    fecha: '',
    hora: '',
    motivo: ''
};

export const useAppointmentForm = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<AppointmentFormData>(INITIAL_STATE);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Predictive Availability Check
    useEffect(() => {
        const check = async () => {
            if (formData.veterinario_id && formData.fecha && formData.hora) {
                setCheckingAvailability(true);
                setErrors(prev => ({ ...prev, availability: '' }));

                try {
                    const result = await dispatch(checkAvailability({
                        veterinario_id: Number(formData.veterinario_id),
                        fecha: formData.fecha,
                        hora: formData.hora
                    })).unwrap();

                    setIsAvailable(result);
                    if (!result) {
                        setErrors(prev => ({ ...prev, availability: 'Horario no disponible' }));
                    }
                } catch {
                    setIsAvailable(null);
                } finally {
                    setCheckingAvailability(false);
                }
            } else {
                setIsAvailable(null);
            }
        };

        const timeoutId = setTimeout(check, 500);
        return () => clearTimeout(timeoutId);
    }, [formData.veterinario_id, formData.fecha, formData.hora, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.mascota_id) newErrors.mascota_id = 'Requerido';
        if (!formData.veterinario_id) newErrors.veterinario_id = 'Requerido';
        if (!formData.fecha) newErrors.fecha = 'Requerido';
        if (!formData.hora) newErrors.hora = 'Requerido';
        if (!isEditing && !formData.dueno_id) newErrors.dueno_id = 'Requerido';
        if (isAvailable === false) newErrors.availability = 'Horario ocupado';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData(INITIAL_STATE);
        setIsAvailable(null);
        setIsEditing(false);
        setEditingId(null);
        setErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const dateTime = `${formData.fecha} ${formData.hora}:00`;

        if (isEditing && editingId) {
            const updateData = {
                mascota_id: Number(formData.mascota_id),
                veterinario_id: Number(formData.veterinario_id),
                servicio_id: Number(formData.servicio_id),
                fecha_hora: dateTime,
                motivo: formData.motivo
            };
            await dispatch(updateTurno({ id: editingId, data: updateData }));
        } else {
            const turnoData = {
                dueno_id: Number(formData.dueno_id),
                mascota_id: Number(formData.mascota_id),
                veterinario_id: Number(formData.veterinario_id),
                servicio_id: Number(formData.servicio_id),
                fecha_hora: dateTime,
                motivo: formData.motivo
            };
            await dispatch(createTurno(turnoData));
        }

        resetForm();
        dispatch(fetchAgendaAdmin(undefined));
    };

    const handleEdit = (turno: Turno) => {
        const fechaHora = new Date(turno.fecha_hora);
        const fecha = fechaHora.toISOString().split('T')[0];
        const hora = fechaHora.toTimeString().slice(0, 5);

        setFormData({
            dueno_id: '',
            mascota_id: turno.mascota_id?.toString() || '',
            veterinario_id: turno.veterinario_id?.toString() || '',
            servicio_id: turno.servicio_id?.toString() || '1',
            fecha,
            hora,
            motivo: turno.motivo || ''
        });
        setIsEditing(true);
        setEditingId(turno.id);
        setErrors({});
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return {
        formData,
        errors,
        isAvailable,
        checkingAvailability,
        isEditing,
        formRef,
        handleChange,
        handleSubmit,
        handleEdit,
        resetForm
    };
};
