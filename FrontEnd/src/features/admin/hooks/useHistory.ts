import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { obtenerHistorialAdmin, obtenerMascotasAdmin, fetchVeterinarios } from '../../../store/slices/adminSlice';
import type { Historial } from '../../../store/slices/adminSlice';

export const useHistory = () => {
    const dispatch = useAppDispatch();
    const { historial: historia, mascotas, veterinarios, cargando } = useAppSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterFecha, setFilterFecha] = useState('');
    const [filterVeterinario, setFilterVeterinario] = useState('');
    const [selectedHistory, setSelectedHistory] = useState<Historial | null>(null);

    useEffect(() => {
        dispatch(obtenerHistorialAdmin());
        dispatch(obtenerMascotasAdmin());
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    // FILTERING LOGIC
    const filteredHistory = (historia || []).filter(h => {
        const matchesSearch =
            (h.mascota_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (h.diagnostico || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (h.tratamiento || '').toLowerCase().includes(searchTerm.toLowerCase());

        const itemDate = h.fecha ? new Date(h.fecha).toISOString().split('T')[0] : '';
        const matchesFecha = filterFecha ? itemDate === filterFecha : true;

        const matchesVeterinario = filterVeterinario ? h.veterinario_id === Number(filterVeterinario) : true;

        return matchesSearch && matchesFecha && matchesVeterinario;
    });

    const vetsOptions = (veterinarios || []).map(v => ({ valor: v.id.toString(), etiqueta: `Dr. ${v.apellido}` }));

    const handleDelete = async (record: Historial) => {
        if (window.confirm(`¿Estás seguro de eliminar el registro del ${record.fecha}?`)) {
            // ELIMINAR REGISTRO (Thunk no implementado en adminSlice, pero manteniendo consistencia)
            // await dispatch(eliminarHistorialAdmin(record.id));
        }
    };

    return {
        historial: filteredHistory,
        cargando,
        mascotas,
        veterinarios,
        vetsOptions: vetsOptions,
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
