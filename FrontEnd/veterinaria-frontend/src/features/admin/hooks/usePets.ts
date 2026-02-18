import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMascotas, deleteMascota, fetchDuenos, type Mascota } from '../../../store/slices/adminSlice';

export const usePets = () => {
    const dispatch = useAppDispatch();
    const { pets, owners, loading } = useAppSelector((state) => state.admin);

    // Filters State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEspecie, setFilterEspecie] = useState('');
    const [filterDueno, setFilterDueno] = useState('');

    useEffect(() => {
        dispatch(fetchMascotas());
        dispatch(fetchDuenos());
    }, [dispatch]);

    const filteredPets = useMemo(() => {
        return pets.filter(pet => {
            const matchesSearch =
                pet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pet.raza || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${pet.dueno_nombre || ''} ${pet.dueno_apellido || ''}`.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEspecie = filterEspecie ? pet.especie === filterEspecie : true;
            const matchesDueno = filterDueno ? pet.dueno_id === Number(filterDueno) : true;

            return matchesSearch && matchesEspecie && matchesDueno;
        });
    }, [pets, searchTerm, filterEspecie, filterDueno]);

    const handleDelete = async (pet: Mascota) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${pet.nombre}?`)) {
            await dispatch(deleteMascota(pet.id));
        }
    };

    const ownersOptions = useMemo(() =>
        owners.map(o => ({ value: o.id.toString(), label: `${o.nombre} ${o.apellido}` })),
        [owners]
    );

    return {
        pets: filteredPets,
        allOwners: owners,
        ownersOptions,
        loading,
        searchTerm,
        setSearchTerm,
        filterEspecie,
        setFilterEspecie,
        filterDueno,
        setFilterDueno,
        handleDelete,
        refresh: () => dispatch(fetchMascotas())
    };
};
