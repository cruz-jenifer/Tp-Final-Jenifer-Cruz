
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { obtenerAgenda, obtenerMascotaPorId } from '../../../store/slices/vetSlice';
import type { AgendaItem } from '../../../types/historial.types';
import type { Mascota } from '../../../types/mascota.types';
// ESTILOS REUTILIZADOS DEL COMPONENTE TABLE
import styles from '../../../components/ui/Table.module.css';
import vet from './VetComponents.module.css';
import { Badge } from '../../../components/ui/Badge';
import { ActionBtn } from '../../../components/ui/ActionBtn';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';

interface AgendaTableProps {
    onSelectTurno: (turno: AgendaItem) => void;
    fecha: string;
    onFechaChange: (fecha: string) => void;
}

export const AgendaTable = ({ onSelectTurno, fecha, onFechaChange }: AgendaTableProps) => {
    const dispatch = useAppDispatch();
    const { agenda, cargando, error } = useAppSelector((state) => state.vet);
    const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'completado'>('todos');
    const [selectedMotive, setSelectedMotive] = useState<string | null>(null);
    const [selectedPet, setSelectedPet] = useState<Mascota | null>(null);
    const [loadingPet, setLoadingPet] = useState(false);

    useEffect(() => {
        dispatch(obtenerAgenda(fecha));
    }, [dispatch, fecha]);

    const handleViewPet = async (petId: number) => {
        setLoadingPet(true);
        try {
            const result = await dispatch(obtenerMascotaPorId(petId)).unwrap();
            setSelectedPet(result);
        } catch (error) {
            console.error('Error fetching pet details:', error);
            alert('Error al cargar datos de la mascota');
        } finally {
            setLoadingPet(false);
        }
    };

    const turnosFiltrados = agenda.filter(turno => {
        if (filtro === 'todos') return true;
        return turno.estado === filtro;
    });



    if (cargando) return <div className={styles.emptyState}><span className="spinner-border text-primary"></span></div>;
    if (error) return <div className={styles.emptyState} style={{ color: 'red' }}>{error}</div>;

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 'Desconocida';
        const birth = new Date(birthDate);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} años`;
    };

    return (
        <Card>
            {/* MODAL PARA VER MOTIVO */}
            {selectedMotive && (
                <div className={vet.modalBackdrop} onClick={() => setSelectedMotive(null)}>
                    <div className={vet.modalCard} onClick={e => e.stopPropagation()}>
                        <h4 className={vet.modalTitle}>Motivo de Consulta Completo</h4>
                        <p className={vet.motivoText}>
                            {selectedMotive}
                        </p>
                        <div className={vet.modalActionsCenter}>
                            <button
                                onClick={() => setSelectedMotive(null)}
                                className={vet.btnPrimary}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PARA VER MASCOTA DETALLADA */}
            {selectedPet && (
                <div className={vet.modalBackdrop} onClick={() => setSelectedPet(null)}>
                    <div className={vet.modalCardCentered} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedPet(null)}
                            className={vet.modalClose}
                        >
                            <span className="material-icons">close</span>
                        </button>

                        <div className={selectedPet.especie === 'Perro' ? vet.petAvatarDog : vet.petAvatarCat}>
                            <span className="material-icons" style={{ fontSize: '40px' }}>pets</span>
                        </div>
                        <h3 className={vet.petModalName}>{selectedPet.nombre}</h3>
                        <div className={vet.badgePills}>
                            <span className={vet.badgePill}>
                                {selectedPet.especie}
                            </span>
                            <span className={vet.badgePill}>
                                {selectedPet.raza}
                            </span>
                        </div>

                        <div className={vet.fichaContainer}>
                            <div className={vet.fichaGrid}>
                                <div>
                                    <span className={vet.fichaLabel}>EDAD</span>
                                    <p className={vet.fichaValue}>{calculateAge(selectedPet.fecha_nacimiento)}</p>
                                </div>
                                <div>
                                    <span className={vet.fichaLabel}>ID SISTEMA</span>
                                    <p className={vet.fichaValue}>#PET-{selectedPet.id}</p>
                                </div>
                            </div>

                            {/* ADVERTENCIAS - SECCION NO DISPONIBLE EN SCHEMA ACTUAL */}
                        </div>

                        <button
                            onClick={() => setSelectedPet(null)}
                            className={vet.btnPrimaryFull}
                        >
                            Cerrar Ficha
                        </button>
                    </div>
                </div>
            )}

            {loadingPet && (
                <div className={vet.loadingOverlay}>
                    <div className={vet.loadingSpinner}>
                        <span className="spinner-border text-primary" style={{ width: '2rem', height: '2rem' }}></span>
                    </div>
                </div>
            )}

            {/* HEADER CON DATE PICKER */}
            <CardHeader
                title="Agenda del Día"
                icon="event_note"
            >
                <div className={vet.filterBar}>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => onFechaChange(e.target.value)}
                        className={vet.filterInput}
                    />
                    <select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value as 'todos' | 'pendiente' | 'completado')}
                        className={vet.filterSelect}
                    >
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="completado">Completados</option>
                    </select>
                </div>
            </CardHeader>

            <CardContent>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th className={styles.textLeft}>TURNO ID</th>
                                <th className={styles.textLeft}>MASCOTA</th>
                                <th className={styles.textLeft}>SERVICIO</th>
                                <th className={styles.textLeft}>HORA</th>
                                <th className={styles.textLeft}>MOTIVO</th>
                                <th className={styles.textCenter}>ESTADO</th>
                                <th className={styles.textCenter}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyState}>
                                        <span className="material-icons" style={{ fontSize: '3rem', opacity: 0.2 }}>event_busy</span>
                                        <p>No hay turnos para esta fecha</p>
                                    </td>
                                </tr>
                            ) : (
                                turnosFiltrados.map((turno) => {

                                    return (
                                        <tr key={turno.id} className={styles.tableRow}>
                                            <td className={styles.textLeft}>
                                                <span className={vet.cellIdBold}>#TRN-{turno.id}</span>
                                            </td>
                                            <td>
                                                <div className={styles.cellWithIcon}>
                                                    <div className={turno.mascota_especie === 'Perro' ? vet.petAvatarSmallDog : vet.petAvatarSmallCat}>
                                                        <span className="material-icons" style={{ fontSize: '18px' }}>pets</span>
                                                    </div>
                                                    <div>
                                                        <div className={styles.cellTextBold}>{turno.mascota_nombre}</div>
                                                        <span className={vet.petIdSmall}>#PET-{turno.mascota_id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.textLeft}>{turno.servicio}</td>
                                            <td>
                                                <div className={vet.cellColumn}>
                                                    <span className={styles.cellTextBold}>
                                                        {turno.hora || 'N/A'}
                                                    </span>
                                                    <span className={vet.cellSubtext}>
                                                        {turno.fecha || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.textLeft}>
                                                <div className={vet.cellColumn}>
                                                    {/* MOTIVO OCULTO, SOLO BOTON */}
                                                    <ActionBtn
                                                        onClick={() => setSelectedMotive(turno.motivo_consulta)}
                                                        icon="visibility"
                                                        label="Ver Motivo"
                                                        variant="primary"
                                                        title="Ver motivo completo"
                                                    />
                                                </div>
                                            </td>
                                            <td className={styles.textCenter}>
                                                <Badge
                                                    text={turno.estado.toUpperCase()}
                                                    variant={(
                                                        turno.estado === 'pendiente' ? 'warning' :
                                                            turno.estado === 'completado' ? 'success' :
                                                                turno.estado === 'cancelado' ? 'danger' :
                                                                    'secondary'
                                                    )}
                                                />
                                            </td>
                                            <td className={styles.textCenter}>
                                                <div className={`${styles.actions} ${vet.actionsCentered}`}>
                                                    <ActionBtn
                                                        onClick={() => handleViewPet(turno.mascota_id)}
                                                        icon="visibility"
                                                        label="Ver"
                                                        variant="secondary"
                                                        title="Ver Ficha Mascota"
                                                    />
                                                    <ActionBtn
                                                        onClick={() => onSelectTurno(turno)}
                                                        icon="assignment_add"
                                                        label="Atender"
                                                        variant="success"
                                                        title="Atender / Ver Historial"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>

            <div className={vet.tableFooter}>
                <span>Turnos del día: {turnosFiltrados.length}</span>
                <span className={vet.tableFooterLink}>Ver mes completo</span>
            </div>
        </Card >
    );
};
