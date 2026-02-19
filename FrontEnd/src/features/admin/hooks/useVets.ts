import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchVeterinarios, eliminarVeterinario, type Veterinario } from '../../../store/slices/adminSlice';

export const useVets = () => {
    const dispatch = useAppDispatch();
    const { veterinarios, cargando } = useAppSelector((state) => state.admin);
    const [selectedVet, setSelectedVet] = useState<Veterinario | null>(null);

    useEffect(() => {
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    const handleDelete = async (vet: Veterinario) => {
        if (window.confirm(`¿Eliminar al veterinario ${vet.nombre}?`)) {
            await dispatch(eliminarVeterinario(vet.id));
        }
    };

    return {
        veterinarios,
        cargando,
        selectedVet,
        setSelectedVet,
        handleDelete
    };
};
