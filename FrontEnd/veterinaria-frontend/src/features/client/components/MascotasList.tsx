import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMascotas } from '../../../store/slices/mascotasSlice';
import { Card } from '../../../components/ui/Card';
import styles from './MascotasList.module.css';

// COMPONENTE PARA MOSTRAR LA LISTA DE MASCOTAS
export const MascotasList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { mascotas, loading, error } = useAppSelector((state) => state.mascotas);

    useEffect(() => {
        if (mascotas.length === 0) {
            dispatch(fetchMascotas());
        }
    }, [dispatch, mascotas.length]);

    if (loading) return <p>Cargando mascotas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.grid}>
            {mascotas.map((pet) => (
                <Card key={pet.id}>
                    {/* IMAGEN DE MASCOTA (PLACEHOLDER) */}
                    <div className={styles.petImage}>
                        <span>🐾</span>
                    </div>

                    <div className={styles.petHeader}>
                        <div>
                            <h3 className={styles.petName}>{pet.nombre}</h3>
                            <p className={styles.petBreed}>{pet.raza} - {pet.especie}</p>
                        </div>
                    </div>

                    {/* DATOS DE LA MASCOTA: EDAD Y PESO */}
                    <div className={styles.petStats}>
                        <div>
                            <p className={styles.statLabel}>EDAD</p>
                            <p className={styles.statValue}>{pet.edad} Años</p>
                        </div>
                        <div>
                            <p className={styles.statLabel}>PESO</p>
                            <p className={styles.statValue}>{pet.peso} kg</p>
                        </div>
                    </div>

                    {/* BOTON DE VER FICHA */}
                    <button className={styles.viewButton}>
                        VER FICHA
                    </button>
                </Card>
            ))}

            {/* TARJETA DE "REGISTRAR MASCOTA" */}
            <div className={styles.addCard}>
                <span className={styles.addIcon}>+</span>
                <h3>Registrar Mascota</h3>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                    Añade una nueva mascota a tu perfil familiar
                </p>
            </div>
        </div>
    );
};
