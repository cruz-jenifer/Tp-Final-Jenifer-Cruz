import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMisTurnos, cancelTurno, deleteTurno, updateTurno } from '../../../store/slices/turnosSlice';
import { fetchMascotas } from '../../../store/slices/mascotasSlice';
import { Badge, type BadgeVariant } from '../../../components/ui/Badge';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { Modal } from '../../../components/ui/Modal';
import { EditTurnoForm } from '../../turnos/EditTurnoForm';
import type { TurnoEstado, Turno } from '../../../types/turno.types';
import styles from '../../../components/ui/Table.module.css';
import { ActionBtn } from '../../../components/ui/ActionBtn';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';

// MAPEO DE ESTADO A VARIANTE DE BADGE
const getStatusVariant = (status: TurnoEstado): BadgeVariant => {
    switch (status) {
        case 'confirmado': return 'success';
        case 'pendiente': return 'warning';
        case 'cancelado': return 'danger';
        case 'realizado': return 'secondary';
        default: return 'primary';
    }
};



// COMPONENTE PARA MOSTRAR LA LISTA DE TURNOS (TABLA)
export const TurnosList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { turnos, loading, error } = useAppSelector((state) => state.turnos);
    const { mascotas } = useAppSelector((state) => state.mascotas);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTurnoId, setSelectedTurnoId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [turnoToEdit, setTurnoToEdit] = useState<Turno | null>(null);
    const [motivoModalOpen, setMotivoModalOpen] = useState(false);
    const [motivoToShow, setMotivoToShow] = useState('');

    useEffect(() => {
        if (turnos.length === 0) {
            dispatch(fetchMisTurnos());
        }
        if (mascotas.length === 0) {
            dispatch(fetchMascotas());
        }
    }, [dispatch, turnos.length, mascotas.length]);

    const handleActionClick = (id: number) => {
        setSelectedTurnoId(id);
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (selectedTurnoId) {
            const turno = turnos.find(t => t.id === selectedTurnoId);
            if (turno?.estado === 'cancelado') {
                await dispatch(deleteTurno(selectedTurnoId));
            } else {
                await dispatch(cancelTurno(selectedTurnoId));
            }
            setIsModalOpen(false);
            setSelectedTurnoId(null);
            dispatch(fetchMisTurnos());
        }
    };

    const handleEditClick = (turno: Turno) => {
        setTurnoToEdit(turno);
        setIsEditModalOpen(true);
    };

    // TIPO DE DATOS DEL FORMULARIO DE EDICION
    interface EditTurnoFormData {
        mascota_id: string;
        servicio_id: string;
        veterinario_id: string;
        fecha: string;
        hora: string;
        motivo: string;
    }

    const handleEditSubmit = async (formData: EditTurnoFormData) => {
        if (!turnoToEdit) return;

        const updateData = {
            mascota_id: Number(formData.mascota_id),
            servicio_id: Number(formData.servicio_id),
            veterinario_id: Number(formData.veterinario_id),
            fecha_hora: `${formData.fecha} ${formData.hora}:00`,
            motivo: formData.motivo,
        };

        await dispatch(updateTurno({ id: turnoToEdit.id, data: updateData }));
        setIsEditModalOpen(false);
        setTurnoToEdit(null);
        dispatch(fetchMisTurnos());
    };

    if (loading && turnos.length === 0) return <p>Cargando turnos...</p>;
    if (error && turnos.length === 0) return <p>Error: {error}</p>;

    // USAR ORDEN DEL BACKEND
    const turnosSorted = turnos;

    const getModalContent = () => {
        const turno = turnos.find(t => t.id === selectedTurnoId);
        const isDeleting = turno?.estado === 'cancelado';
        return {
            title: isDeleting ? "Eliminar Historial" : "Cancelar Turno",
            message: isDeleting
                ? "¿Deseas eliminar este registro permanentemente?"
                : "¿Estás seguro de que deseas cancelar este turno? Esta acción no se puede deshacer.",
            confirmText: isDeleting ? "Eliminar" : "Cancelar Turno",
            isDanger: true
        };
    };

    const modalContent = getModalContent();

    return (
        <Card>
            <CardHeader
                title="Agenda del Día"
                icon="today"
            >
                <span className={styles.nextVisitBadge}>
                    HOY: {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </CardHeader>

            <CardContent>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th className={styles.textLeft}>FECHA</th>
                                <th className={styles.textLeft}>HORA</th>
                                <th className={styles.textLeft}>MASCOTA</th>
                                <th className={styles.textLeft}>SERVICIO</th>
                                <th className={styles.textLeft}>MOTIVO</th>
                                <th className={styles.textCenter}>ESTADO</th>
                                <th className={styles.textCenter}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnosSorted.map((turno) => (
                                <tr key={turno.id} className={styles.tableRow}>
                                    <td>
                                        <div className={styles.cellWithIcon}>
                                            <span className="material-icons">event</span>
                                            <span>{new Date(turno.fecha_hora.replace(' ', 'T')).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.cellWithIcon}>
                                            <span className="material-icons">schedule</span>
                                            <span>{new Date(turno.fecha_hora.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.cellWithIcon}>
                                            <span className="material-icons">pets</span>
                                            <span>{turno.mascota || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.cellWithIcon}>
                                            <span className="material-icons">medical_services</span>
                                            <span>{turno.servicio || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {turno.motivo && (
                                            <ActionBtn
                                                onClick={() => { setMotivoToShow(turno.motivo || ''); setMotivoModalOpen(true); }}
                                                icon="visibility"
                                                label="Ver motivo"
                                                variant="primary"
                                            />
                                        )}
                                    </td>
                                    <td className={styles.textCenter}>
                                        <Badge
                                            text={turno.estado.toUpperCase()}
                                            variant={getStatusVariant(turno.estado)}
                                        />
                                    </td>
                                    <td className={styles.textCenter}>
                                        <div className={styles.actions}>
                                            {turno.estado !== 'cancelado' && turno.estado !== 'realizado' && (
                                                <ActionBtn
                                                    onClick={() => handleEditClick(turno)}
                                                    icon="edit"
                                                    title="Editar turno"
                                                    variant="secondary"
                                                />
                                            )}

                                            {turno.estado !== 'realizado' && (
                                                <ActionBtn
                                                    onClick={() => handleActionClick(turno.id)}
                                                    icon={turno.estado === 'cancelado' ? 'delete' : 'close'}
                                                    title={turno.estado === 'cancelado' ? "Eliminar registro" : "Cancelar turno"}
                                                    variant="danger"
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(loading || turnos.length === 0) && !loading && (
                    <div className={styles.emptyState}>
                        <span className="material-icons">event_busy</span>
                        <p>No tienes turnos próximos.</p>
                    </div>
                )}

                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmAction}
                    title={modalContent.title}
                    message={modalContent.message}
                    confirmText={modalContent.confirmText}
                    isDanger={modalContent.isDanger}
                />

                {/* MODAL DE EDICION */}
                {isEditModalOpen && turnoToEdit && (
                    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                        <EditTurnoForm
                            turno={turnoToEdit}
                            onSubmit={handleEditSubmit}
                            onCancel={() => setIsEditModalOpen(false)}
                        />
                    </Modal>
                )}

                {/* MODAL DE MOTIVO */}
                {motivoModalOpen && (
                    <Modal isOpen={motivoModalOpen} onClose={() => setMotivoModalOpen(false)}>
                        <div style={{ padding: '1.5rem' }}>
                            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>Motivo de la consulta</h2>
                            <p style={{ lineHeight: '1.6', color: '#374151' }}>{motivoToShow}</p>
                            <button
                                onClick={() => setMotivoModalOpen(false)}
                                style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </Modal>
                )}
            </CardContent>
        </Card>
    );
};
