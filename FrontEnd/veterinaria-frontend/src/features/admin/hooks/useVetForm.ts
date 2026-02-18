import { useState, useRef } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { createVeterinario, updateVeterinario, type Veterinario } from '../../../store/slices/veterinariosSlice';

export const useVetForm = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        id: undefined as number | undefined,
        nombre: '',
        apellido: '',
        email: '',
        matricula: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ id: undefined, nombre: '', apellido: '', email: '', matricula: '' });
        setIsEditing(false);
    };

    const handleSubmit = async (onSuccess?: (vet: Veterinario) => void) => {
        if (!formData.nombre || !formData.apellido || !formData.email || !formData.matricula) return alert('COMPLETE TODOS LOS CAMPOS');

        if (isEditing && formData.id) {
            await dispatch(updateVeterinario({ id: formData.id, data: formData }));
            resetForm();
        } else {
            try {
                const result = await dispatch(createVeterinario(formData)).unwrap();
                if (result.clave_temporal) {
                    // alert(`VETERINARIO CREADO. CLAVE TEMPORAL: ${result.clave_temporal}`);
                    if (onSuccess) onSuccess(result);
                } else if (onSuccess) {
                    onSuccess(result);
                }
                resetForm();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                alert(`ERROR: ${message}`);
                return;
            }
        }
    };

    const handleEdit = (vet: Veterinario) => {
        setFormData({
            id: vet.id,
            nombre: vet.nombre,
            apellido: vet.apellido,
            email: vet.email || '',
            matricula: vet.matricula || ''
        });
        setIsEditing(true);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return {
        formData,
        isEditing,
        formRef,
        handleChange,
        handleSubmit,
        handleEdit,
        resetForm
    };
};
