import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { obtenerServicios, eliminarServicio, type Servicio } from '../../../store/slices/serviciosSlice';

export const useServices = () => {
    const dispatch = useAppDispatch();
    const { servicios, cargando, error } = useAppSelector((state) => state.servicios);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Servicio | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

    useEffect(() => {
        dispatch(obtenerServicios());
    }, [dispatch]);

    const handleCreate = () => {
        setSelectedService(null);
        setIsFormOpen(true);
    };

    const handleEdit = (servicio: Servicio) => {
        setSelectedService(servicio);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setServiceToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (serviceToDelete) {
            await dispatch(eliminarServicio(serviceToDelete));
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedService(null);
    };

    return {
        servicios,
        cargando,
        error,
        isFormOpen,
        selectedService,
        isDeleteModalOpen,
        handleCreate,
        handleEdit,
        handleDeleteClick,
        handleConfirmDelete,
        handleFormClose,
        setIsDeleteModalOpen,
        refresh: () => dispatch(obtenerServicios())
    };
};
