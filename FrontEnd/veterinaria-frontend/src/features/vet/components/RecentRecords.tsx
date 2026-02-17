
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchHistorialReciente, deleteHistorial, updateHistorial } from '../../../store/slices/vetSlice';
// ESTILOS REUTILIZADOS
import styles from '../../../components/ui/Table.module.css';
import { ActionBtn } from '../../../components/ui/ActionBtn';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';

export const RecentRecords = () => {
    const dispatch = useAppDispatch();
    const { historialesRecientes, loading } = useAppSelector((state) => state.vet);

    // ESTADOS LOCALES PARA MODALES
    const [editingRecord, setEditingRecord] = useState<any | null>(null);

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

    const handleEditClick = (record: any) => {
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
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '1rem',
                        maxWidth: '500px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <h3 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Editar Historial</h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#4b5563' }}>Diagnóstico</label>
                            <input
                                type="text"
                                value={editForm.diagnostico}
                                onChange={(e) => setEditForm({ ...editForm, diagnostico: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#4b5563' }}>Tratamiento</label>
                            <input
                                type="text"
                                value={editForm.tratamiento}
                                onChange={(e) => setEditForm({ ...editForm, tratamiento: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                onClick={() => setEditingRecord(null)}
                                style={{ padding: '0.5rem 1.5rem', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontWeight: 600, color: '#6b7280' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                style={{ padding: '0.5rem 1.5rem', cursor: 'pointer', backgroundColor: '#3b82f6', border: 'none', borderRadius: '0.5rem', fontWeight: 600, color: 'white' }}
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
                <div style={{ position: 'relative', width: '250px' }}>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        style={{
                            width: '100%', padding: '0.4rem 1rem 0.4rem 2.5rem', borderRadius: '9999px',
                            border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none',
                            fontSize: '0.875rem'
                        }}
                    />
                    <span className="material-icons" style={{
                        position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '18px', color: '#9ca3af'
                    }}>search</span>
                </div>
            </CardHeader>

            <CardContent>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th className={styles.textLeft}>FECHA</th>
                                <th className={styles.textLeft}>MASCOTA</th>
                                <th className={styles.textLeft} style={{ width: '40%' }}>TRATAMIENTO</th>
                                <th className={styles.textCenter}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className={styles.emptyState}>Cargando...</td></tr>
                            ) : historialesRecientes.length === 0 ? (
                                <tr><td colSpan={4} className={styles.emptyState}>No hay registros recientes</td></tr>
                            ) : (
                                historialesRecientes.map((record) => {
                                    // GENERAR COLOR DE FONDO ALEATORIO BASADO EN ID
                                    const bgColors = ['#eff6ff', '#f0fdf4', '#fef2f2', '#fff7ed', '#faf5ff'];
                                    const textColors = ['#1d4ed8', '#15803d', '#b91c1c', '#c2410c', '#7e22ce'];
                                    const colorIdx = record.mascota_id % bgColors.length;

                                    return (
                                        <tr key={record.id} className={styles.tableRow}>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className={styles.cellTextBold}>
                                                        {new Date(record.fecha).toLocaleDateString()}
                                                    </span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                        {new Date(record.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.cellWithIcon}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '0.375rem',
                                                        backgroundColor: bgColors[colorIdx], color: textColors[colorIdx],
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                                    }}>
                                                        {record.mascota_nombre ? record.mascota_nombre.charAt(0) : '?'}
                                                    </div>
                                                    <div>
                                                        <div className={styles.cellTextBold}>{record.mascota_nombre}</div>
                                                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>#PET-{record.mascota_id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className={styles.cellTextBold}>{record.tratamiento}</span>
                                                    <span style={{ fontSize: '0.85rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                                                        {record.diagnostico}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.textCenter}>
                                                <div className={styles.actions} style={{ justifyContent: 'center', gap: '0.5rem' }}>
                                                    <div className={styles.actions} style={{ justifyContent: 'center', gap: '0.5rem' }}>
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
