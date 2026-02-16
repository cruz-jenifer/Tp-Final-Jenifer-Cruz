import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMascotas, deleteMascota } from '../../../store/slices/mascotasSlice';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import styles from './MascotasList.module.css';

// COMPONENTE PARA MOSTRAR LA LISTA DE MASCOTAS
export const MascotasList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { mascotas, loading, error } = useAppSelector((state) => state.mascotas);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<any | null>(null);

    useEffect(() => {
        if (mascotas.length === 0) {
            dispatch(fetchMascotas());
        }
    }, [dispatch, mascotas.length]);

    const handleDeleteClick = (id: number) => {
        setSelectedPetId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedPetId) {
            await dispatch(deleteMascota(selectedPetId));
            setDeleteModalOpen(false);
            setSelectedPetId(null);
        }
    };

    const handleViewClick = (pet: any) => {
        setSelectedPet(pet);
        setViewModalOpen(true);
    };

    if (loading) return <p>Cargando mascotas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.grid}>
            {mascotas.map((pet) => (
                <div key={pet.id} className={styles.card}>
                    <button
                        className={styles.deleteBtn}
                        title="Eliminar perfil"
                        onClick={() => handleDeleteClick(pet.id)}
                    >
                        <span className="material-icons">delete</span>
                    </button>

                    {/* STITCH: AREA DE IMAGEN DE TARJETA */}
                    <div className={styles.cardImageArea}>
                        <div className={styles.cardIcon}>
                            <span className="material-icons">pets</span>
                        </div>
                        <div className={styles.speciesBadge}>
                            {pet.especie}
                        </div>
                    </div>

                    {/* STITCH: CONTENIDO DE TARJETA */}
                    <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h3 className={styles.petName}>{pet.nombre}</h3>
                                <p className={styles.petBreed}>{pet.raza}</p>
                            </div>
                            <div className={styles.genderIcon}>
                                <span className="material-symbols-outlined">
                                    {/* LOGICA DE ICONO DE GENERO SI ESTA DISPONIBLE */}
                                    pets
                                </span>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div>
                                <p className={styles.statLabel}>EDAD</p>
                                <p className={styles.statValue}>
                                    {new Date().getFullYear() - new Date(pet.fecha_nacimiento).getFullYear()} Años
                                </p>
                            </div>
                            <div>
                                <p className={styles.statLabel}>PESO</p>
                                <p className={styles.statValue}>-- kg</p>
                            </div>
                        </div>

                        <button
                            className={styles.viewButton}
                            onClick={() => handleViewClick(pet)}
                        >
                            <span className="material-icons">visibility</span>
                            Ver ficha
                        </button>
                    </div>
                </div>
            ))}

            {/* STITCH: TARJETA DE AGREGAR MASCOTA */}
            <div
                className={styles.addCard}
                onClick={() => alert('El registro de nuevas mascotas debe ser realizado por la veterinaria en esta versión.')}
                style={{ cursor: 'pointer' }}
            >
                <div className={styles.addIconCircle}>
                    <span className="material-icons">add</span>
                </div>
                <h3 className={styles.addTitle}>Registrar Mascota</h3>
                <p className={styles.addSubtitle}>Añade una nueva mascota a tu perfil familiar</p>
            </div>

            {/* MODAL DE CONFIRMACION PARA ELIMINAR */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar Mascota"
                message="¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer."
                confirmText="Sí, eliminar"
                isDanger
            />

            {/* MODAL SIMPLE PARA VER FICHA */}
            {viewModalOpen && selectedPet && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setViewModalOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
                >
                    <div
                        className="bg-white p-6 rounded-lg max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', maxWidth: '28rem', width: '100%' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ficha de {selectedPet.nombre}</h3>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Especie:</strong> {selectedPet.especie}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Raza:</strong> {selectedPet.raza}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Fecha de Nacimiento:</strong> {new Date(selectedPet.fecha_nacimiento).toLocaleDateString()}
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Edad:</strong> {new Date().getFullYear() - new Date(selectedPet.fecha_nacimiento).getFullYear()} años
                        </div>
                        <button
                            onClick={() => setViewModalOpen(false)}
                            style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#6384FF', color: 'white', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
