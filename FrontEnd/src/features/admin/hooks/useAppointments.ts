import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { obtenerAgendaAdmin, cancelarTurno, eliminarTurno } from '../../../store/slices/turnosSlice';
import { obtenerDuenos, obtenerMascotasAdmin, fetchVeterinarios } from '../../../store/slices/adminSlice';
import type { Turno } from '../../../types/turno.types';

export const useAppointments = () => {
    const dispatch = useAppDispatch();
    const { turnos, cargando } = useAppSelector((state) => state.turnos);
    const { duenos, mascotas, veterinarios } = useAppSelector((state) => state.admin);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFecha, setFilterFecha] = useState('');
    const [filterVeterinario, setFilterVeterinario] = useState('');

    useEffect(() => {
        dispatch(obtenerAgendaAdmin(undefined));
        dispatch(obtenerDuenos());
        dispatch(obtenerMascotasAdmin());
        dispatch(fetchVeterinarios());
    }, [dispatch]);

    const filteredTurnos = useMemo(() => {
        const safeTurnos = Array.isArray(turnos) ? turnos : [];
        return safeTurnos.filter(t => {
            const matchesSearch =
                (t.mascota || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.motivo_consulta || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.veterinario_nombre && t.veterinario_nombre.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesFecha = filterFecha ? (t.fecha || '').startsWith(filterFecha) : true;
            const matchesVeterinario = filterVeterinario ? t.veterinario_id === Number(filterVeterinario) : true;

            return matchesSearch && matchesFecha && matchesVeterinario;
        });
    }, [turnos, searchTerm, filterFecha, filterVeterinario]);

    const handleCancel = async (turno: Turno) => {
        if (window.confirm('¿Cancelar este turno?')) {
            await dispatch(cancelarTurno(turno.id));
            dispatch(obtenerAgendaAdmin(undefined));
        }
    };

    const handleDelete = async (turno: Turno) => {
        if (window.confirm('¿Eliminar este turno definitivamente?')) {
            await dispatch(eliminarTurno(turno.id));
            dispatch(obtenerAgendaAdmin(undefined));
        }
    };

    const vetsOptions = useMemo(() =>
        (Array.isArray(veterinarios) ? veterinarios : []).map(v => ({ valor: v.id.toString(), etiqueta: `Dr. ${v.apellido}` })),
        [veterinarios]);

    return {
        turnos: filteredTurnos,
        cargando,
        duenos,
        mascotas,
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
        refresh: () => dispatch(obtenerAgendaAdmin(undefined))
    };
};
