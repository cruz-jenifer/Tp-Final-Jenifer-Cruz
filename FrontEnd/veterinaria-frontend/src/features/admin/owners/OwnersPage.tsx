import { useState, useRef } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { useOwners } from '../hooks/useOwners';
import { OwnerForm } from './OwnerForm';
import OwnerDetailsModal from './OwnerDetailsModal';
import GenericTable, { type Column, type Action } from '../../../components/ui/GenericTable';
import FilterBar from '../../../components/ui/FilterBar';
import PageHeader from '../../../components/ui/PageHeader';
import styles from './OwnersPage.module.css';
import type { Owner } from '../../../store/slices/adminSlice';

export const OwnersPage = () => {
    const { owners, loading, handleDelete, refresh, searchTerm, setSearchTerm } = useOwners();
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

    const handleSuccessCallback = () => {
        setSelectedOwner(null);
        refresh();
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
                    <Avatar initials={`${owner.nombre.charAt(0)}${owner.apellido.charAt(0)}`} variant="blue" size="sm" />
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
            <PageHeader
                title="Dueños"
                subtitle="Gestión de base de datos de clientes"
                icon="people"
                badgeText="Clientes Activos"
            />

            <FilterBar
                filters={[]}
                onFilterChange={() => { }}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por nombre, email o DNI..."
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
                data={owners}
                actions={actions}
                keyExtractor={(owner) => owner.id}
                isLoading={loading}
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
