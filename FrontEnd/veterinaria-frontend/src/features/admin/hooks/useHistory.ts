import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchHistorial, deleteHistorial, fetchMascotas, type Historial } from '../../../store/slices/adminSlice';
import { fetchVeterinarios } from '../../../store/slices/veterinariosSlice';

export const useHistory = () => {
    const dispatch = useAppDispatch();
    const { history, pets, loading } = useAppSelector((state) => state.admin);
    const { veterinarios } = useAppSelector((state) => state.veterinarios);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterFecha, setFilterFecha] = useState('');
    const [filterVeterinario, setFilterVeterinario] = useState('');
    const [selectedHistory, setSelectedHistory] = useState<Historial | null>(null);

    useEffect(() => {
        dispatch(fetchHistorial());
        dispatch(fetchMascotas());
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    // FILTERING LOGIC
    const filteredHistory = history.filter(h => {
        const matchesSearch =
            (h.mascota_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (h.diagnostico || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (h.tratamiento || '').toLowerCase().includes(searchTerm.toLowerCase());

        const itemDate = h.fecha ? new Date(h.fecha).toISOString().split('T')[0] : '';
        const matchesFecha = filterFecha ? itemDate === filterFecha : true;

        const matchesVeterinario = filterVeterinario ? h.veterinario_id === Number(filterVeterinario) : true;

        return matchesSearch && matchesFecha && matchesVeterinario;
    });

    const vetsOptions = veterinarios.map(v => ({ value: v.id.toString(), label: `Dr. ${v.apellido}` }));

    const handleDelete = async (record: Historial) => {
        if (window.confirm(`¿Estás seguro de eliminar el registro del ${record.fecha}?`)) {
            await dispatch(deleteHistorial(record.id));
        }
    };

    return {
        history: filteredHistory,
        loading,
        pets,
        veterinarios,
        vetsOptions,
        searchTerm,
        setSearchTerm,
        filterFecha,
        setFilterFecha,
        filterVeterinario,
        setFilterVeterinario,
        selectedHistory,
        setSelectedHistory,
        handleDelete
    };
};
