
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAgenda, fetchMascotaById } from '../../../store/slices/vetSlice';
import type { IAgendaItem, IMascota } from '../../../types/historia.types';
// ESTILOS REUTILIZADOS DEL COMPONENTE TABLE
import styles from '../../../components/ui/Table.module.css';
import { Badge } from '../../../components/ui/Badge';
import { ActionBtn } from '../../../components/ui/ActionBtn';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';

interface AgendaTableProps {
    onSelectTurno: (turno: IAgendaItem) => void;
    fecha: string;
    onFechaChange: (fecha: string) => void;
}

export const AgendaTable = ({ onSelectTurno, fecha, onFechaChange }: AgendaTableProps) => {
    const dispatch = useAppDispatch();
    const { agenda, loading, error } = useAppSelector((state) => state.vet);
    const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'completado'>('todos');
    const [selectedMotive, setSelectedMotive] = useState<string | null>(null);
    const [selectedPet, setSelectedPet] = useState<IMascota | null>(null);
    const [loadingPet, setLoadingPet] = useState(false);

    useEffect(() => {
        dispatch(fetchAgenda(fecha));
    }, [dispatch, fecha]);

    const handleViewPet = async (petId: number) => {
        setLoadingPet(true);
        try {
            const result = await dispatch(fetchMascotaById(petId)).unwrap();
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



    if (loading) return <div className={styles.emptyState}><span className="spinner-border text-primary"></span></div>;
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
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setSelectedMotive(null)}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '1rem',
                        maxWidth: '500px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#1f2937' }}>Motivo de Consulta Completo</h4>
                        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                            {selectedMotive}
                        </p>
                        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => setSelectedMotive(null)}
                                style={{
                                    backgroundColor: '#3b82f6', color: 'white', border: 'none',
                                    padding: '0.5rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PARA VER MASCOTA DETALLADA */}
            {selectedPet && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setSelectedPet(null)}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '1rem',
                        maxWidth: '450px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        textAlign: 'center', position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedPet(null)}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af'
                            }}
                        >
                            <span className="material-icons">close</span>
                        </button>

                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem',
                            backgroundColor: selectedPet.especie === 'Perro' ? '#fff3cd' : '#dbeafe',
                            color: selectedPet.especie === 'Perro' ? '#b45309' : '#1d4ed8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem'
                        }}>
                            <span className="material-icons" style={{ fontSize: '40px' }}>pets</span>
                        </div>
                        <h3 style={{ margin: '0 0 0.25rem 0', color: '#1f2937' }}>{selectedPet.nombre}</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '0.1rem 0.6rem', borderRadius: '99px' }}>
                                {selectedPet.especie}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '0.1rem 0.6rem', borderRadius: '99px' }}>
                                {selectedPet.raza}
                            </span>
                        </div>

                        <div style={{ textAlign: 'left', backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>EDAD</span>
                                    <p style={{ margin: 0, fontWeight: 500, color: '#4b5563' }}>{calculateAge(selectedPet.fecha_nacimiento)}</p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600 }}>ID SISTEMA</span>
                                    <p style={{ margin: 0, fontWeight: 500, color: '#4b5563' }}>#PET-{selectedPet.id}</p>
                                </div>
                            </div>

                            {/* ADVERTENCIAS - SECCION IMPORTANTE */}
                            {selectedPet.advertencias && selectedPet.advertencias !== 'Ninguna' && (
                                <div style={{
                                    marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2',
                                    borderRadius: '0.5rem', border: '1px solid #fecaca'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#b91c1c', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                        <span className="material-icons" style={{ fontSize: '16px' }}>warning</span>
                                        ADVERTENCIAS
                                    </span>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#7f1d1d' }}>{selectedPet.advertencias}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedPet(null)}
                            style={{
                                backgroundColor: '#3b82f6', color: 'white', border: 'none',
                                padding: '0.6rem 2rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600,
                                width: '100%', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
                            }}
                        >
                            Cerrar Ficha
                        </button>
                    </div>
                </div>
            )}

            {loadingPet && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
                }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <span className="spinner-border text-primary" style={{ width: '2rem', height: '2rem' }}></span>
                    </div>
                </div>
            )}

            {/* HEADER CON DATE PICKER */}
            <CardHeader
                title="Agenda del Día"
                icon="event_note"
            >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => onFechaChange(e.target.value)}
                        style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '0.3rem 0.6rem',
                            fontFamily: 'inherit',
                            color: '#4b5563',
                            outline: 'none'
                        }}
                    />
                    <select
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value as any)}
                        style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '0.35rem 2rem 0.35rem 0.75rem',
                            fontFamily: 'inherit',
                            color: '#4b5563',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            appearance: 'none'
                        }}
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
                                                <span style={{ fontWeight: 'bold', color: '#6b7280' }}>#TRN-{turno.id}</span>
                                            </td>
                                            <td>
                                                <div className={styles.cellWithIcon}>
                                                    <div
                                                        style={{
                                                            width: '32px', height: '32px', borderRadius: '50%',
                                                            backgroundColor: turno.mascota_especie === 'Perro' ? '#fff3cd' : '#dbeafe',
                                                            color: turno.mascota_especie === 'Perro' ? '#b45309' : '#1d4ed8',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}
                                                    >
                                                        <span className="material-icons" style={{ fontSize: '18px' }}>pets</span>
                                                    </div>
                                                    <div>
                                                        <div className={styles.cellTextBold}>{turno.mascota_nombre}</div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>#PET-{turno.mascota_id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.textLeft}>{turno.servicio}</td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className={styles.cellTextBold}>
                                                        {new Date(turno.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        {new Date(turno.fecha_hora).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.textLeft}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                                                    {/* MOTIVO OCULTO, SOLO BOTON */}
                                                    <ActionBtn
                                                        onClick={() => setSelectedMotive(turno.motivo)}
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
                                                                turno.estado === 'realizado' ? 'success' :
                                                                    turno.estado === 'cancelado' ? 'danger' :
                                                                        'secondary'
                                                    )}
                                                />
                                            </td>
                                            <td className={styles.textCenter}>
                                                <div className={styles.actions} style={{ justifyContent: 'center', gap: '0.5rem' }}>
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

            <div style={{ padding: '1rem 2rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#9ca3af' }}>
                <span>Turnos del día: {turnosFiltrados.length}</span>
                <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>Ver mes completo</span>
            </div>
        </Card >
    );
};
