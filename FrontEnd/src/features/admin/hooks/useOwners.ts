import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { obtenerDuenos, eliminarDueno, type Dueno as Owner } from '../../../store/slices/adminSlice';

export const useOwners = () => {
    const dispatch = useAppDispatch();
    const { duenos, cargando } = useAppSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(obtenerDuenos());
    }, [dispatch]);

    const handleDelete = async (owner: Owner) => {
        if (window.confirm(`¿Estás seguro de eliminar al dueño ${owner.nombre} ${owner.apellido}?`)) {
            await dispatch(eliminarDueno(owner.id));
        }
    };

    const filteredOwners = (duenos || []).filter(owner =>
        (owner.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.apellido || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.dni || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.telefono || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        duenos: filteredOwners,
        cargando,
        searchTerm,
        setSearchTerm,
        handleDelete,
        refresh: () => dispatch(obtenerDuenos())
    };
};
