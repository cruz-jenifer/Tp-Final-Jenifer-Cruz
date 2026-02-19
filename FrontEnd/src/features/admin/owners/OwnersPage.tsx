import { useState, useRef } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { useOwners } from '../hooks/useOwners';
import { OwnerForm } from './OwnerForm';
import OwnerDetailsModal from './OwnerDetailsModal';
import GenericTable, { type Column, type Action } from '../../../components/ui/GenericTable';
import BarraFiltros from '../../../components/ui/FilterBar';
import EncabezadoPagina from '../../../components/ui/PageHeader';
import styles from './OwnersPage.module.css';
import type { Dueno as Owner } from '../../../store/slices/adminSlice';

export const OwnersPage = () => {
    const { duenos, cargando, handleDelete, refresh, searchTerm, setSearchTerm } = useOwners();
    const formRef = useRef<HTMLDivElement>(null);

    // ESTADO PARA EDICION
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

    // ESTADO MODAL DETALLES
    const [detailsOwner, setDetailsOwner] = useState<Owner | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleEdit = (owner: Owner) => {
        setSelectedOwner(owner);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleCancelEdit = () => {
        setSelectedOwner(null);
    };

    const handleViewDetails = (owner: Owner) => {
        setDetailsOwner(owner);
        setIsDetailsOpen(true);
    };

    const handleSuccessCallback = (nuevo_dueno?: Owner) => {
        setSelectedOwner(null);
        refresh();
        // ABRIR MODAL CON CLAVE TEMPORAL SI ES UN NUEVO DUENO
        if (nuevo_dueno?.clave_temporal) {
            setDetailsOwner(nuevo_dueno);
            setIsDetailsOpen(true);
        }
    };

    // DEFINICION DE COLUMNAS PARA GenericTable
    const columns: Column<Owner>[] = [
        {
            header: 'ID',
            accessor: (owner) => <span className={styles.textCell}>#OWN-{owner.id}</span>
        },
        {
            header: 'Nombre Completo',
            accessor: (owner) => (
                <div className={styles.nameCell}>
                    <Avatar initials={`${(owner.nombre ?? '?').charAt(0)}${(owner.apellido ?? '?').charAt(0)}`} variant="blue" size="sm" />
                    <span className={styles.nameText}>
                        {owner.nombre} {owner.apellido}
                    </span>
                </div>
            )
        },
        {
            header: 'Email',
            accessor: (owner) => <span className={styles.textCell}>{owner.email}</span>
        },
        {
            header: 'Teléfono',
            accessor: (owner) => <span className={styles.textCell}>{owner.telefono}</span>
        },
        {
            header: 'Detalles',
            accessor: (owner) => (
                <button
                    onClick={() => handleViewDetails(owner)}
                    className={styles.btnDetails}
                    title="Ver Detalles y Contraseña"
                >
                    Ver más
                </button>
            ),
            className: styles.centerAlign
        }
    ];

    // DEFINICION DE ACCIONES
    const actions: Action<Owner>[] = [
        {
            icon: <span className="material-icons" style={{ fontSize: '1.125rem' }}>edit</span>,
            onClick: handleEdit,
            className: styles.btnEdit,
            title: 'Editar'
        },
        {
            icon: <span className="material-icons" style={{ fontSize: '1.125rem' }}>delete</span>,
            onClick: handleDelete,
            className: styles.btnDelete,
            title: 'Eliminar'
        }
    ];

    return (
        <div className={styles.pageContainer}>
            <EncabezadoPagina
                titulo="Dueños"
                subtitulo="Gestión de base de datos de clientes"
                icono="people"
                textoInsignia="Clientes Activos"
            />

            <BarraFiltros
                filtros={[]}
                alCambiarFiltro={() => { }}
                valorBusqueda={searchTerm}
                alCambiarBusqueda={setSearchTerm}
                placeholderBusqueda="Buscar por nombre, email o DNI..."
            />

            <div ref={formRef}>
                <OwnerForm
                    ownerToEdit={selectedOwner}
                    onCancelEdit={handleCancelEdit}
                    onSuccess={handleSuccessCallback}
                />
            </div>

            <GenericTable
                columns={columns}
                data={duenos}
                actions={actions}
                keyExtractor={(owner) => owner.id}
                isLoading={cargando}
                emptyMessage="No hay dueños registrados."
                pageSize={10}
            />

            <OwnerDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                owner={detailsOwner}
            />
        </div>
    );
};

export default OwnersPage;
