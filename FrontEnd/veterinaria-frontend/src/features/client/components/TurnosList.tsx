import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchTurnos } from '../../../store/slices/turnosSlice';
import { Badge, type BadgeVariant } from '../../../components/ui/Badge';
import type { TurnoEstado } from '../../../types/turno.types';
import styles from './TurnosList.module.css';

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

    useEffect(() => {
        if (turnos.length === 0) {
            dispatch(fetchTurnos());
        }
    }, [dispatch, turnos.length]);

    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (

        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {/* ENCABEZADOS DE TABLA SEGUN DISEÑO */}
                        <th>FECHA</th>
                        <th>HORA</th>
                        <th>MASCOTA</th>
                        <th>SERVICIO</th>
                        <th style={{ textAlign: 'center' }}>ESTADO</th>
                        <th style={{ textAlign: 'center' }}>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {turnos.map((turno) => (
                        <tr key={turno.id}>
                            <td>{turno.fecha}</td>
                            <td>{turno.hora}</td>
                            <td>{turno.mascotaNombre}</td>
                            <td>{turno.motivo}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Badge
                                    text={turno.estado.toUpperCase()}
                                    variant={getStatusVariant(turno.estado)}
                                />
                            </td>
                            <td className={styles.actions} style={{ justifyContent: 'center' }}>
                                {/* BOTONES DE ACCION: EDITAR Y CANCELAR */}
                                <button className={styles.actionButton} title="Editar turno">
                                    Editar
                                </button>
                                <button
                                    className={styles.actionButton}
                                    style={{ color: 'red', borderColor: 'red' }}
                                    title="Cancelar turno"
                                >
                                    Cancelar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
