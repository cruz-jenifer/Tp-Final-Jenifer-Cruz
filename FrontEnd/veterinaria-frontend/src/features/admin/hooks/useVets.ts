import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchVeterinarios, deleteVeterinario, type Veterinario } from '../../../store/slices/veterinariosSlice';

export const useVets = () => {
    const dispatch = useAppDispatch();
    const { veterinarios, loading } = useAppSelector((state) => state.veterinarios);
    const [selectedVet, setSelectedVet] = useState<Veterinario | null>(null);

    useEffect(() => {
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    const handleDelete = async (vet: Veterinario) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${vet.nombre} ${vet.apellido}?`)) {
            await dispatch(deleteVeterinario(vet.id));
        }
    };

    return {
        veterinarios,
        loading,
        selectedVet,
        setSelectedVet,
        handleDelete
    };
};
