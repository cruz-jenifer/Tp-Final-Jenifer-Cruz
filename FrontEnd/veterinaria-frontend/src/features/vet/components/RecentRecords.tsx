
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchHistorialReciente, deleteHistorial, updateHistorial } from '../../../store/slices/vetSlice';
import type { HistorialDetalle } from '../../../types/historial.types';
// ESTILOS REUTILIZADOS
import tableStyles from '../../../components/ui/Table.module.css';
import vet from './VetComponents.module.css';
import { ActionBtn } from '../../../components/ui/ActionBtn';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';

export const RecentRecords = () => {
    const dispatch = useAppDispatch();
    const { historialesRecientes, loading } = useAppSelector((state) => state.vet);

    // ESTADOS LOCALES PARA MODALES
    const [editingRecord, setEditingRecord] = useState<HistorialDetalle | null>(null);

    // FORMULARIO DE EDICION
    const [editForm, setEditForm] = useState({
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
    });

    useEffect(() => {
        dispatch(fetchHistorialReciente());
    }, [dispatch]);

    // MANEJADORES
    const handleDeleteClick = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.')) {
            dispatch(deleteHistorial(id));
        }
    };

    const handleEditClick = (record: HistorialDetalle) => {
        setEditingRecord(record);
        setEditForm({
            diagnostico: record.diagnostico,
            tratamiento: record.tratamiento,
            observaciones: record.observaciones || ''
        });
    };

    const handleSaveEdit = async () => {
        if (!editingRecord) return;
        try {
            await dispatch(updateHistorial({ id: editingRecord.id, data: editForm })).unwrap();
            setEditingRecord(null);
            alert('Registro actualizado correctamente');
        } catch (error) {
            alert('Error al actualizar: ' + error);
        }
    };

    return (
        <Card>
            {/* MODAL DE EDICION (SIMPLE) */}
            {editingRecord && (
                <div className={vet.modalBackdrop}>
                    <div className={vet.modalCard}>
                        <h3 className={vet.modalTitleSpaced}>Editar Historial</h3>

                        <div className={vet.formGroup}>
                            <label className={vet.formLabel}>Diagnóstico</label>
                            <input
                                type="text"
                                value={editForm.diagnostico}
                                onChange={(e) => setEditForm({ ...editForm, diagnostico: e.target.value })}
                                className={vet.formInput}
                            />
                        </div>

                        <div className={vet.formGroup}>
                            <label className={vet.formLabel}>Tratamiento</label>
                            <input
                                type="text"
                                value={editForm.tratamiento}
                                onChange={(e) => setEditForm({ ...editForm, tratamiento: e.target.value })}
                                className={vet.formInput}
                            />
                        </div>

                        <div className={vet.modalActions}>
                            <button
                                onClick={() => setEditingRecord(null)}
                                className={vet.btnCancel}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className={vet.btnPrimary}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CardHeader
                title="Historial Reciente"
                icon="history"
            >
                {/* BARRA DE BUSQUEDA PERSONALIZADA PARA COINCIDIR ESTILOS */}
                <div className={vet.searchContainer}>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className={vet.searchInput}
                    />
                    <span className={`material-icons ${vet.searchIcon}`}>search</span>
                </div>
            </CardHeader>

            <CardContent>
                <div className={tableStyles.tableContainer}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.tableHeader}>
                                <th className={tableStyles.textLeft}>FECHA</th>
                                <th className={tableStyles.textLeft}>MASCOTA</th>
                                <th className={`${tableStyles.textLeft} ${vet.colWide}`}>TRATAMIENTO</th>
                                <th className={tableStyles.textCenter}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className={tableStyles.emptyState}>Cargando...</td></tr>
                            ) : historialesRecientes.length === 0 ? (
                                <tr><td colSpan={4} className={tableStyles.emptyState}>No hay registros recientes</td></tr>
                            ) : (
                                historialesRecientes.map((record) => {
                                    // GENERAR COLOR DE FONDO ALEATORIO BASADO EN ID
                                    const bgColors = ['#eff6ff', '#f0fdf4', '#fef2f2', '#fff7ed', '#faf5ff'];
                                    const textColors = ['#1d4ed8', '#15803d', '#b91c1c', '#c2410c', '#7e22ce'];
                                    const colorIdx = record.mascota_id % bgColors.length;

                                    return (
                                        <tr key={record.id} className={tableStyles.tableRow}>
                                            <td>
                                                <div className={vet.cellColumn}>
                                                    <span className={tableStyles.cellTextBold}>
                                                        {new Date(record.fecha).toLocaleDateString()}
                                                    </span>
                                                    <span className={vet.cellSubtext}>
                                                        {new Date(record.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={tableStyles.cellWithIcon}>
                                                    <div
                                                        className={vet.colorAvatar}
                                                        style={{
                                                            backgroundColor: bgColors[colorIdx],
                                                            color: textColors[colorIdx]
                                                        }}
                                                    >
                                                        {record.mascota_nombre ? record.mascota_nombre.charAt(0) : '?'}
                                                    </div>
                                                    <div>
                                                        <div className={tableStyles.cellTextBold}>{record.mascota_nombre}</div>
                                                        <span className={vet.cellSubtext}>#PET-{record.mascota_id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={vet.cellColumn}>
                                                    <span className={tableStyles.cellTextBold}>{record.tratamiento}</span>
                                                    <span className={vet.diagnosisText}>
                                                        {record.diagnostico}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={tableStyles.textCenter}>
                                                <div className={`${tableStyles.actions} ${vet.actionsCentered}`}>
                                                    <ActionBtn
                                                        onClick={() => handleEditClick(record)}
                                                        icon="edit"
                                                        label="Editar"
                                                        variant="primary"
                                                        title="Editar Registro"
                                                    />
                                                    <ActionBtn
                                                        onClick={() => handleDeleteClick(record.id)}
                                                        icon="delete"
                                                        label="Eliminar"
                                                        variant="danger"
                                                        title="Eliminar Registro"
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
        </Card>
    );
};
