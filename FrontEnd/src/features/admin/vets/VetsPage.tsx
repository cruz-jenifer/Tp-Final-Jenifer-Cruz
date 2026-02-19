import React from 'react';
import { useVets } from '../hooks/useVets';
import { useVetForm } from '../hooks/useVetForm';
import GenericTable, { type Column, type Action } from '../../../components/ui/GenericTable';
import styles from './VetsPage.module.css';
import type { Veterinario } from '../../../store/slices/adminSlice';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import VetDetailsModal from './VetDetailsModal';

const VetsPage: React.FC = () => {
    // CUSTOM HOOKS
    const {
        veterinarios, cargando,
        selectedVet, setSelectedVet, handleDelete
    } = useVets();

    const {
        datosFormulario, editando, referenciaFormulario,
        manejarCambio, manejarEnvio, manejarEdicion, resetearFormulario
    } = useVetForm();

    const columns: Column<Veterinario>[] = [
        {
            header: 'ID',
            accessor: (vet) => <span style={{ fontWeight: 700, color: '#9ca3af' }}>#VET-{vet.id}</span>
        },
        {
            header: 'Nombre',
            accessor: (vet) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar initials="DR" variant="primary" size="sm" />
                    <span className={styles.cellTitle}>{vet.nombre} {vet.apellido}</span>
                </div>
            )
        },
        {
            header: 'Matrícula',
            accessor: (vet) => (
                <span className={styles.cellSubtitle}>{vet.matricula || 'N/A'}</span>
            )
        },
        {
            header: 'Email',
            accessor: (vet) => (
                <span className={styles.cellSubtitle}>{vet.email || 'No registrado'}</span>
            )
        },
        {
            header: 'Detalles',
            accessor: (vet) => (
                <button
                    className={styles.actionButton}
                    style={{ fontSize: '0.75rem', textDecoration: 'underline', color: '#6384FF', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setSelectedVet(vet)}
                >
                    Ver más
                </button>
            )
        },
    ];

    const actions: Action<Veterinario>[] = [
        {
            icon: <span className="material-icons" style={{ fontSize: '1.25rem' }}>edit</span>,
            label: 'Editar',
            onClick: manejarEdicion,
            title: 'Editar'
        },
        {
            icon: <span className="material-icons" style={{ fontSize: '1.25rem', color: '#ef4444' }}>delete</span>,
            label: 'Eliminar',
            onClick: handleDelete,
            title: 'Eliminar'
        }
    ];

    return (
        <div>
            {/* ENCABEZADO DE SECCION */}
            <div className={styles.sectionHeader}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconBox}>
                        <span className="material-icons" style={{ fontSize: '1.875rem' }}>medical_services</span>
                    </div>
                    <div>
                        <h2 className={styles.pageTitle}>Veterinarios</h2>
                        <p className={styles.pageSubtitle}>Gestión del equipo médico</p>
                    </div>
                </div>
                <Badge text="Equipo Médico" variant="primary" />
            </div>

            {/* FORMULARIO INLINE */}
            <div ref={referenciaFormulario} className={styles.inlineFormCard} style={{ borderLeft: editando ? '4px solid #6384FF' : 'none' }}>
                <h3 className={styles.inlineFormTitle} style={{ color: '#6384FF' }}>
                    <span className="material-icons">{editando ? 'edit' : 'person_add'}</span>
                    {editando ? 'Editar Veterinario' : 'Registrar Nuevo Veterinario'}
                </h3>
                <div className={styles.inlineFormGrid}>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>Nombre</label>
                        <input name="nombre" value={datosFormulario.nombre} onChange={manejarCambio} type="text" className={styles.inputField} placeholder="Ej: Juan" />
                    </div>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>Apellido</label>
                        <input name="apellido" value={datosFormulario.apellido} onChange={manejarCambio} type="text" className={styles.inputField} placeholder="Ej: Perez" />
                    </div>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>Email</label>
                        {/* Email readonly if editing because we don't fetch it yet to populate correctly, avoids overwriting with empty */}
                        <input name="email" value={datosFormulario.email} onChange={manejarCambio} type="email" className={styles.inputField} placeholder="Ej: dr.juan@vet.com" disabled={editando} />
                    </div>
                    <div className={styles.inlineFormGroup}>
                        <label className={styles.inlineLabel}>Matrícula</label>
                        <input name="matricula" value={datosFormulario.matricula} onChange={manejarCambio} type="text" className={styles.inputField} placeholder="Ej: MP-12345" />
                    </div>
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        className={styles.saveButton}
                        style={{ height: 'fit-content', padding: '0.8rem 2rem', borderRadius: '1rem', backgroundColor: '#6384FF' }}
                        onClick={() => manejarEnvio((newVet) => setSelectedVet(newVet))}
                    >
                        <span className="material-icons" style={{ fontSize: '1rem', marginRight: '5px' }}>{editando ? 'save' : 'add'}</span>
                        {editando ? 'Actualizar' : 'Agregar Veterinario'}
                    </button>
                    {editando && (
                        <button
                            onClick={resetearFormulario}
                            style={{ padding: '0.8rem', background: 'none', border: '1px solid #ddd', borderRadius: '1rem', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            {/* TABLA DE LISTADO */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className="material-icons" style={{ color: '#6384FF', fontSize: '1.25rem' }}>table_view</span>
                    <h3 className={styles.tableTitle}>
                        Directorio Médico
                    </h3>
                </div>

                <div className={styles.tableContent}>
                    {cargando ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Cargando veterinarios...</div>
                    ) : (
                        <GenericTable
                            columns={columns}
                            data={veterinarios}
                            actions={actions}
                            keyExtractor={(vet) => vet.id}
                            emptyMessage="No hay veterinarios registrados."
                        />
                    )}
                </div>
            </div>

            {/* MODAL DETALLES */}
            <VetDetailsModal
                isOpen={!!selectedVet}
                onClose={() => setSelectedVet(null)}
                vet={selectedVet}
            />
        </div>
    );
};

export default VetsPage;
