import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { crearHistorial, actualizarHistorial } from '../../../store/slices/vetSlice';
import type { Historial, Veterinario } from '../../../store/slices/adminSlice';

export const useHistoryForm = () => {
    const dispatch = useAppDispatch();
    const { mascotas, veterinarios } = useAppSelector((state) => state.admin);
    const formRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        mascota_id: '',
        veterinario_id: '',
        fecha: new Date().toISOString().split('T')[0],
        diagnostico: '',
        tratamiento: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.mascota_id) newErrors.mascota_id = 'Requerido';
        else if (!mascotas.find(p => p.id === Number(formData.mascota_id))) newErrors.mascota_id = 'Mascota no encontrada';

        if (!formData.diagnostico) newErrors.diagnostico = 'Requerido';

        if (formData.veterinario_id && !veterinarios.find((v: Veterinario) => v.id === Number(formData.veterinario_id))) {
            newErrors.veterinario_id = 'Veterinario no encontrado';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({ mascota_id: '', veterinario_id: '', fecha: new Date().toISOString().split('T')[0], diagnostico: '', tratamiento: '' });
        setIsEditing(false);
        setEditingId(null);
        setErrors({});
    };

    const handleSubmit = async (onSuccess?: () => void) => {
        if (!validateForm()) return;

        if (isEditing && editingId) {
            // ACTUALIZAR
            const updateData = {
                diagnostico: formData.diagnostico,
                tratamiento: formData.tratamiento || 'N/A'
            };
            await dispatch(actualizarHistorial({ id: editingId, datos: updateData }));
        } else {
            // CREAR
            const now = new Date();
            const fechaFormatted = now.toISOString().slice(0, 19).replace('T', ' ');

            const histData = {
                mascota_id: Number(formData.mascota_id),
                veterinario_id: formData.veterinario_id ? Number(formData.veterinario_id) : undefined,
                fecha: fechaFormatted,
                diagnostico: formData.diagnostico,
                tratamiento: formData.tratamiento || 'N/A'
            };
            await dispatch(crearHistorial(histData));
        }

        resetForm();
        if (onSuccess) onSuccess();
    };

    const handleEdit = (record: Historial) => {
        setFormData({
            mascota_id: record.mascota_id.toString(),
            veterinario_id: record.veterinario_id?.toString() || '',
            fecha: record.fecha ? new Date(record.fecha).toISOString().split('T')[0] : '',
            diagnostico: record.diagnostico || '',
            tratamiento: record.tratamiento || ''
        });
        setIsEditing(true);
        setEditingId(record.id);
        setErrors({});
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return {
        formData,
        errors,
        isEditing,
        formRef,
        handleChange,
        handleSubmit,
        handleEdit,
        resetForm
    };
};
