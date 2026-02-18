import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { createMascota, updateMascota, type Mascota } from '../../../store/slices/adminSlice';
import { isRequired } from '../../../utils/validators';

interface PetFormData {
    nombre: string;
    especie: string;
    raza: string;
    fecha_nacimiento: string;
    dueno_id: string;
}

const INITIAL_STATE: PetFormData = {
    nombre: '',
    especie: 'Perro',
    raza: '',
    fecha_nacimiento: '',
    dueno_id: ''
};

export const usePetForm = (petToEdit?: Mascota | null, onSuccess?: () => void) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<PetFormData>(INITIAL_STATE);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (petToEdit) {
            setFormData({
                nombre: petToEdit.nombre,
                especie: petToEdit.especie,
                raza: petToEdit.raza,
                fecha_nacimiento: petToEdit.fecha_nacimiento ? petToEdit.fecha_nacimiento.split('T')[0] : '',
                dueno_id: petToEdit.dueno_id.toString()
            });
        } else {
            setFormData(INITIAL_STATE);
        }
        setErrors({});
    }, [petToEdit]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nombre) newErrors.nombre = 'Requerido';
        if (!formData.raza) newErrors.raza = 'Requerido';
        if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'Requerido';
        if (!formData.dueno_id) newErrors.dueno_id = 'Requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                dueno_id: Number(formData.dueno_id)
            };

            if (petToEdit) {
                await dispatch(updateMascota({ id: petToEdit.id, data: payload })).unwrap();
            } else {
                await dispatch(createMascota(payload)).unwrap();
                setFormData(INITIAL_STATE);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error saving pet:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset: () => setFormData(INITIAL_STATE)
    };
};
