import { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { crearDueno, actualizarDueno, limpiarMensajes, type Dueno } from '../../../store/slices/adminSlice';
import { isRequired, isValidEmail } from '../../../utils/validators';


interface OwnerFormData {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: string;
}

const INITIAL_STATE: OwnerFormData = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    dni: ''
};

export const useOwnerForm = (ownerToEdit?: Dueno | null, onSuccess?: (dueno?: Dueno) => void) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState<OwnerFormData>(INITIAL_STATE);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (ownerToEdit) {
            setFormData({
                nombre: ownerToEdit.nombre || '',
                apellido: ownerToEdit.apellido || '',
                email: ownerToEdit.email || '',
                telefono: ownerToEdit.telefono || '',
                dni: ownerToEdit.dni || ''
            });
        } else {
            setFormData(INITIAL_STATE);
        }
        setErrors({});
    }, [ownerToEdit]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        const nombreError = isRequired(formData.nombre);
        if (nombreError) newErrors.nombre = nombreError;

        const apellidoError = isRequired(formData.apellido);
        if (apellidoError) newErrors.apellido = apellidoError;

        const emailError = isRequired(formData.email) || isValidEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const telefonoError = isRequired(formData.telefono);
        if (telefonoError) newErrors.telefono = telefonoError;

        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (ownerToEdit) {
                await dispatch(actualizarDueno({ id: ownerToEdit.id, datos: formData })).unwrap();
                if (onSuccess) onSuccess();
            } else {
                // CAPTURAR EL DUENO CREADO CON CLAVE_TEMPORAL
                const nuevo_dueno = await dispatch(crearDueno(formData)).unwrap();
                setFormData(INITIAL_STATE);
                if (onSuccess) onSuccess(nuevo_dueno as Dueno);
            }
            dispatch(limpiarMensajes());
        } catch (error: any) {
            // Manejo de errores específicos si es necesario
            if (typeof error === 'string' && error.includes('email')) {
                setErrors(prev => ({ ...prev, email: error }));
            }
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
