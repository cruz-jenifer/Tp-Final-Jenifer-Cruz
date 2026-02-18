import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchDuenos, deleteDueno, type Owner } from '../../../store/slices/adminSlice';

export const useOwners = () => {
    const dispatch = useAppDispatch();
    const { owners, loading } = useAppSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchDuenos());
    }, [dispatch]);

    const handleDelete = async (owner: Owner) => {
        if (window.confirm(`¿Estás seguro de eliminar al dueño ${owner.nombre} ${owner.apellido}?`)) {
            await dispatch(deleteDueno(owner.id));
        }
    };

    const filteredOwners = owners.filter(owner =>
        owner.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.dni && owner.dni.includes(searchTerm))
    );

    return {
        owners: filteredOwners,
        loading,
        searchTerm,
        setSearchTerm,
        handleDelete,
        refresh: () => dispatch(fetchDuenos())
    };
};
