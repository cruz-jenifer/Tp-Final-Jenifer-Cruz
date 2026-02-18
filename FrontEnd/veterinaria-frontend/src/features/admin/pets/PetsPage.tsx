import { useState, useRef } from 'react';
import { usePets } from '../hooks/usePets';
import { PetForm } from './PetForm';
import GenericTable, { type Column, type Action } from '../../../components/ui/GenericTable';
import FilterBar from '../../../components/ui/FilterBar';
import PageHeader from '../../../components/ui/PageHeader';
import styles from './PetsPage.module.css';
import type { Mascota } from '../../../store/slices/adminSlice';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';

export const PetsPage = () => {
    const {
        pets,
        loading,
        ownersOptions,
        searchTerm,
        setSearchTerm,
        filterEspecie,
        setFilterEspecie,
        filterDueno,
        setFilterDueno,
        handleDelete,
        refresh
    } = usePets();

    const formRef = useRef<HTMLDivElement>(null);

    // ESTADO PARA EDICION
    const [selectedPet, setSelectedPet] = useState<Mascota | null>(null);

    // ESTADO MODAL DETALLES
    const [detailsPet, setDetailsPet] = useState<Mascota | null>(null);

    const handleEdit = (pet: Mascota) => {
        setSelectedPet(pet);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleCancelEdit = () => {
        setSelectedPet(null);
    };

    const handleViewDetails = (pet: Mascota) => {
        setDetailsPet(pet);
    };

    const closeDetails = () => {
        setDetailsPet(null);
    };

    const handleSuccessCallback = () => {
        setSelectedPet(null);
        refresh();
    };

    // DEFINICION DE COLUMNAS
    const columns: Column<Mascota>[] = [
        {
            header: 'ID',
            accessor: (pet) => <span className={styles.textCell}>#PET-{pet.id}</span>
        },
        {
            header: 'Nombre',
            accessor: (pet) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Avatar icon="pets" variant="orange" size="md" />
                    <span className={styles.nameText}>{pet.nombre}</span>
                </div>
            )
        },
        {
            header: 'Especie',
            accessor: (pet) => (
                <Badge text={pet.especie} variant="warning" />
            )
        },
        {
            header: 'Dueño',
            accessor: (pet) => (
                <span className={styles.cellSubtitle}>
                    ID: {pet.dueno_id} - {pet.dueno_nombre} {pet.dueno_apellido}
                </span>
            )
        },
        {
            header: 'Detalles',
            accessor: (pet) => (
                <button
                    onClick={() => handleViewDetails(pet)}
                    className={styles.btnDetails}
                >
                    Ver más
                </button>
            ),
            className: styles.centerAlign
        }
    ];

    // DEFINICION DE ACCIONES
    const actions: Action<Mascota>[] = [
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
                title="Mascotas"
                subtitle="Pacientes activos en la clínica"
                icon="pets"
                badgeText="Pacientes"
            />

            <div ref={formRef}>
                <PetForm
                    petToEdit={selectedPet}
                    onCancelEdit={handleCancelEdit}
                    onSuccess={handleSuccessCallback}
                />
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-icons" style={{ color: '#f97316', fontSize: '1.25rem' }}>list_alt</span>
                        <h3 className={styles.tableTitle}>Pacientes</h3>
                    </div>
                    <FilterBar
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        searchPlaceholder="Buscar por nombre, raza o dueño..."
                        filters={[
                            {
                                name: 'especie',
                                label: 'Especie',
                                value: filterEspecie,
                                options: [
                                    { value: 'Perro', label: 'Perro' },
                                    { value: 'Gato', label: 'Gato' },
                                    { value: 'Otro', label: 'Otro' },
                                ]
                            },
                            {
                                name: 'dueno',
                                label: 'Dueño',
                                value: filterDueno,
                                options: ownersOptions
                            }
                        ]}
                        onFilterChange={(name, value) => {
                            if (name === 'especie') setFilterEspecie(value);
                            if (name === 'dueno') setFilterDueno(value);
                        }}
                    />
                </div>

                <div className={styles.tableContent}>
                    <GenericTable
                        columns={columns}
                        data={pets}
                        actions={actions}
                        keyExtractor={(pet) => pet.id}
                        isLoading={loading}
                        emptyMessage="No hay mascotas registradas."
                        pageSize={10}
                    />
                </div>
            </div>

            {/* MODAL DE DETALLES (Mantenemos inline por simplicidad o moveríamos a componente aparte) */}
            {detailsPet && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <button
                            onClick={closeDetails}
                            className={styles.closeModalBtn}
                        >
                            <span className="material-icons">close</span>
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <Avatar icon="pets" variant="orange" size="xl" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>{detailsPet.nombre}</h3>
                            <Badge text={detailsPet.especie} variant="warning" />
                        </div>

                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <label>RAZA</label>
                                <div>{detailsPet.raza || 'No especificada'}</div>
                            </div>
                            <div className={styles.detailItem}>
                                <label>FECHA DE NACIMIENTO</label>
                                <div>
                                    {detailsPet.fecha_nacimiento ? new Date(detailsPet.fecha_nacimiento).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <label>DUEÑO</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, color: '#6384FF' }}>#{detailsPet.dueno_id}</span>
                                    <span>{detailsPet.dueno_nombre} {detailsPet.dueno_apellido}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button
                                onClick={closeDetails}
                                className={styles.closeBtn}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetsPage;
