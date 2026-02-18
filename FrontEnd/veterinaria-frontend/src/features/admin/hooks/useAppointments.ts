import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAgendaAdmin, cancelTurno, deleteTurno } from '../../../store/slices/turnosSlice';
import { fetchDuenos, fetchMascotas } from '../../../store/slices/adminSlice';
import { fetchVeterinarios } from '../../../store/slices/veterinariosSlice';
import type { Turno } from '../../../types/turno.types';

export const useAppointments = () => {
    const dispatch = useAppDispatch();
    const { turnos, loading } = useAppSelector((state) => state.turnos);
    const { owners, pets } = useAppSelector((state) => state.admin);
    const { veterinarios } = useAppSelector((state) => state.veterinarios);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFecha, setFilterFecha] = useState('');
    const [filterVeterinario, setFilterVeterinario] = useState('');

    useEffect(() => {
        dispatch(fetchAgendaAdmin(undefined));
        dispatch(fetchDuenos());
        dispatch(fetchMascotas());
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    const filteredTurnos = useMemo(() => {
        return turnos.filter(t => {
            const matchesSearch =
                (t.mascota || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.motivo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.veterinario_nombre && t.veterinario_nombre.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesFecha = filterFecha ? t.fecha_hora.startsWith(filterFecha) : true;
            const matchesVeterinario = filterVeterinario ? t.veterinario_id === Number(filterVeterinario) : true;

            return matchesSearch && matchesFecha && matchesVeterinario;
        });
    }, [turnos, searchTerm, filterFecha, filterVeterinario]);

    const handleCancel = async (turno: Turno) => {
        if (window.confirm('¿Cancelar este turno?')) {
            await dispatch(cancelTurno(turno.id));
            dispatch(fetchAgendaAdmin(undefined));
        }
    };

    const handleDelete = async (turno: Turno) => {
        if (window.confirm('¿Eliminar este turno definitivamente?')) {
            await dispatch(deleteTurno(turno.id));
            dispatch(fetchAgendaAdmin(undefined));
        }
    };

    const vetsOptions = useMemo(() =>
        veterinarios.map(v => ({ value: v.id.toString(), label: `Dr. ${v.apellido}` })),
        [veterinarios]);

    return {
        turnos: filteredTurnos,
        loading,
        owners,
        pets,
        veterinarios,
        vetsOptions,
        searchTerm,
        setSearchTerm,
        filterFecha,
        setFilterFecha,
        filterVeterinario,
        setFilterVeterinario,
        handleCancel,
        handleDelete,
        refresh: () => dispatch(fetchAgendaAdmin(undefined))
    };
};
