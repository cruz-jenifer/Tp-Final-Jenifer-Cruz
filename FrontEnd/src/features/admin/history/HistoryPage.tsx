import React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { obtenerHistorialAdmin, type Historial } from '../../../store/slices/adminSlice';
import GenericTable, { type Column, type Action } from '../../../components/ui/GenericTable';
import BarraFiltros from '../../../components/ui/FilterBar';
import EncabezadoPagina from '../../../components/ui/PageHeader';
import styles from './HistoryPage.module.css';
import { useHistory } from '../hooks/useHistory';
import { useHistoryForm } from '../hooks/useHistoryForm';

const HistoryPage: React.FC = () => {
    const dispatch = useAppDispatch();

    // CUSTOM HOOKS
    const {
        historial, cargando, mascotas, veterinarios, vetsOptions,
        searchTerm, setSearchTerm, filterFecha, setFilterFecha, filterVeterinario, setFilterVeterinario,
        selectedHistory, setSelectedHistory, handleDelete
    } = useHistory();

    const {
        formData, errors, isEditing, formRef,
        handleChange, handleSubmit, handleEdit, resetForm
    } = useHistoryForm();

    // WRAPPER PARA SUBMIT QUE RECARGA LA LISTA
    const onFormSubmit = async () => {
        await handleSubmit(() => {
            dispatch(obtenerHistorialAdmin());
        });
    };

    const columns: Column<Historial>[] = [
        {
            header: 'Fecha',
            accessor: (h) => (
                <span style={{ fontWeight: 600, color: '#374151' }}>
                    {h.fecha ? new Date(h.fecha).toLocaleDateString() : 'N/A'}
                </span>
            )
        },
        {
            header: 'Mascota',
            accessor: (h) => (
                <div>
                    <div className={styles.cellTitle}>{h.mascota_nombre}</div>
                    <div className={styles.cellSubtitle}>ID: {h.mascota_id}</div>
                </div>
            )
        },
        {
            header: 'Diagnóstico',
            accessor: (h) => (
                <span className={styles.badgeYellow} style={{ textTransform: 'none' }}>
                    {h.diagnostico}
                </span>
            )
        },
        {
            header: 'Veterinario',
            accessor: (h) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-icons" style={{ fontSize: '1rem', color: '#9ca3af' }}>account_circle</span>
                    <span className={styles.cellSubtitle}>{h.vet_nombre} {h.vet_apellido}</span>
                </div>
            )
        },
        {
            header: 'Detalles',
            accessor: (h) => (
                <button
                    className={styles.actionButton}
                    style={{ fontSize: '0.75rem', textDecoration: 'underline', color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setSelectedHistory(h)}
                >
                    Ver más
                </button>
            )
        }
    ];

    const actions: Action<Historial>[] = [
        {
            icon: <span className="material-icons" style={{ fontSize: '1.25rem' }}>edit</span>,
            label: 'Editar',
            onClick: handleEdit,
            title: 'Editar Registro'
        },
        {
            icon: <span className="material-icons" style={{ fontSize: '1.25rem', color: '#ef4444' }}>delete</span>,
            label: 'Eliminar',
            onClick: handleDelete,
            title: 'Eliminar'
        }
    ];

    return (
        <div className={styles.pageContainer}>
            {/* ENCABEZADO DE SECCION */}
            <EncabezadoPagina
                titulo="Historial Clínico"
                subtitulo="Registro de consultas y tratamientos"
                icono="history_edu"
                textoInsignia="Consultas"
            />

            {/* FORMULARIO INLINE */}
            <div ref={formRef} className={styles.inlineFormCard} style={{ borderLeft: isEditing ? '4px solid #10b981' : 'none' }}>
                <h3 className={styles.inlineFormTitle} style={{ color: '#10b981' }}>
                    <span className="material-icons">{isEditing ? 'edit' : 'add_to_photos'}</span>
                    {isEditing ? 'Editar Entrada del Historial' : 'Añadir Entrada al Historial'}
                </h3>
                <div className={styles.inlineFormGrid}>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>ID Mascota</label>
                        <input
                            name="mascota_id"
                            value={formData.mascota_id}
                            onChange={handleChange}
                            type="text"
                            list="petsListHist"
                            className={`${styles.inputField} ${errors.mascota_id ? styles.inputError : ''}`}
                            placeholder="#PET-..."
                            disabled={isEditing}
                        />
                        <datalist id="petsListHist">
                            {mascotas.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.especie})</option>)}
                        </datalist>
                        {errors.mascota_id && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.mascota_id}</span>}
                    </div>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>ID Veterinario</label>
                        <input
                            name="veterinario_id"
                            value={formData.veterinario_id}
                            onChange={handleChange}
                            type="text"
                            list="vetsListHist"
                            className={`${styles.inputField} ${errors.veterinario_id ? styles.inputError : ''}`}
                            placeholder="#VET-..."
                            disabled={isEditing}
                        />
                        <datalist id="vetsListHist">
                            {veterinarios.map(v => <option key={v.id} value={v.id}>{v.nombre} {v.apellido}</option>)}
                        </datalist>
                        {errors.veterinario_id && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.veterinario_id}</span>}
                    </div>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>Fecha</label>
                        <input
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            type="date"
                            className={styles.inputField}
                            disabled={isEditing}
                        />
                    </div>
                    <div className={styles.inlineFormGroup} style={{ flex: 2 }}>
                        <label className={styles.inlineLabel}>Diagnóstico</label>
                        <input
                            name="diagnostico"
                            value={formData.diagnostico}
                            onChange={handleChange}
                            type="text"
                            className={`${styles.inputField} ${errors.diagnostico ? styles.inputError : ''}`}
                            placeholder="Diagnóstico principal"
                        />
                        {errors.diagnostico && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.diagnostico}</span>}
                    </div>
                    <div className={styles.inlineFormGroup} style={{ flex: 2 }}>
                        <label className={styles.inlineLabel}>Tratamiento</label>
                        <input
                            name="tratamiento"
                            value={formData.tratamiento}
                            onChange={handleChange}
                            type="text"
                            className={styles.inputField}
                            placeholder="Tratamiento recetado"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <button
                            className={styles.saveButton}
                            style={{ height: 'fit-content', padding: '0.8rem 2rem', borderRadius: '1rem' }}
                            onClick={onFormSubmit}
                        >
                            <span className="material-icons" style={{ fontSize: '1rem', marginRight: '5px' }}>{isEditing ? 'save' : 'add'}</span>
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </button>
                        {isEditing && (
                            <button
                                onClick={resetForm}
                                style={{ padding: '0.8rem', background: 'none', border: '1px solid #ddd', borderRadius: '1rem', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* TABLA DE LISTADO */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader} style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-icons" style={{ color: '#10b981', fontSize: '1.25rem' }}>assignment</span>
                        <h3 className={styles.tableTitle}>
                            Historial Reciente
                        </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            type="date"
                            className={styles.inputField}
                            style={{ width: 'auto', padding: '0.5rem 1rem' }}
                            value={filterFecha}
                            onChange={(e) => setFilterFecha(e.target.value)}
                        />
                        <BarraFiltros
                            valorBusqueda={searchTerm}
                            alCambiarBusqueda={setSearchTerm}
                            placeholderBusqueda="Buscar en historial..."
                            filtros={[
                                {
                                    nombre: 'veterinario',
                                    etiqueta: 'Veterinario',
                                    valor: filterVeterinario,
                                    opciones: vetsOptions
                                }
                            ]}
                            alCambiarFiltro={(nombre, valor) => {
                                if (nombre === 'veterinario') setFilterVeterinario(valor);
                            }}
                        />
                    </div>
                </div>

                <div className={styles.tableContent}>
                    {cargando ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando historiales...</div>
                    ) : (
                        <GenericTable
                            columns={columns}
                            data={historial}
                            actions={actions}
                            keyExtractor={(h) => h.id}
                            emptyMessage="No hay registros en el historial."
                        />
                    )}
                </div>
            </div>

            {/* MODAL DETALLES */}
            {selectedHistory && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className={styles.registerCard} style={{ width: '500px', margin: 0, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button
                            onClick={() => setSelectedHistory(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <span className="material-icons">close</span>
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                            <div style={{ color: '#10b981', marginBottom: '0.5rem' }}>
                                <span className="material-icons" style={{ fontSize: '2.5rem' }}>history_edu</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>Historia Clínica</h3>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Fecha: {new Date(selectedHistory.fecha).toLocaleString()}
                            </span>
                        </div>

                        <div className={styles.detailsGrid} style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>MASCOTA</label>
                                <div style={{ fontWeight: 600, color: '#374151', fontSize: '1.1rem' }}>{selectedHistory.mascota_nombre}</div>
                                <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>ID: {selectedHistory.mascota_id}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>VETERINARIO</label>
                                <div style={{ fontWeight: 600, color: '#374151' }}>{selectedHistory.vet_nombre} {selectedHistory.vet_apellido}</div>
                            </div>

                            <div style={{ gridColumn: 'span 2', backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#d97706', marginBottom: '0.25rem' }}>DIAGNÓSTICO</label>
                                <div style={{ color: '#b45309', fontWeight: 500 }}>{selectedHistory.diagnostico}</div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>TRATAMIENTO</label>
                                <p style={{ margin: 0, color: '#374151' }}>{selectedHistory.tratamiento || 'N/A'}</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem' }}>
                            <button
                                onClick={() => setSelectedHistory(null)}
                                style={{ padding: '0.75rem 2rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
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

export default HistoryPage;
