import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { obtenerMascotasAdmin, eliminarMascotaAdmin, obtenerDuenos } from '../../../store/slices/adminSlice';
import type { Mascota } from '../../../types/mascota.types';

// HOOK PERSONALIZADO PARA GESTION DE MASCOTAS (ADMIN)
export const usePets = () => {
    const despacho = useAppDispatch();
    const { mascotas, duenos, cargando } = useAppSelector((state) => state.admin);

    // ESTADO DE FILTROS
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [filtroEspecie, setFiltroEspecie] = useState('');
    const [filtroDueno, setFiltroDueno] = useState('');

    useEffect(() => {
        despacho(obtenerMascotasAdmin());
        despacho(obtenerDuenos());
    }, [despacho]);

    const mascotasFiltradas = useMemo(() => {
        return mascotas.filter(pet => {
            const coincideBusqueda =
                pet.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                (pet.raza || '').toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                `${pet.dueno_nombre || ''} ${pet.dueno_apellido || ''}`.toLowerCase().includes(terminoBusqueda.toLowerCase());

            const coincideEspecie = filtroEspecie ? pet.especie === filtroEspecie : true;
            const coincideDueno = filtroDueno ? pet.dueno_id === Number(filtroDueno) : true;

            return coincideBusqueda && coincideEspecie && coincideDueno;
        });
    }, [mascotas, terminoBusqueda, filtroEspecie, filtroDueno]);

    const manejarEliminacion = async (pet: Mascota) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${pet.nombre}?`)) {
            await despacho(eliminarMascotaAdmin(pet.id));
        }
    };

    const opcionesDuenos = useMemo(() =>
        duenos.map(o => ({ valor: o.id.toString(), etiqueta: `${o.nombre} ${o.apellido}` })),
        [duenos]);

    return {
        mascotas: mascotasFiltradas,
        todosLosDuenos: duenos,
        opcionesDuenos: opcionesDuenos,
        cargando,
        searchTerm: terminoBusqueda,
        setSearchTerm: setTerminoBusqueda,
        filterEspecie: filtroEspecie,
        setFilterEspecie: setFiltroEspecie,
        filterDueno: filtroDueno,
        setFilterDueno: setFiltroDueno,
        handleDelete: manejarEliminacion,
        refresh: () => despacho(obtenerMascotasAdmin())
    };
};
