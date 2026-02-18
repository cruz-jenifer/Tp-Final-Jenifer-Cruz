import React from 'react';
import GenericTable, { type Column } from '../../../components/ui/GenericTable';
import FilterBar from '../../../components/ui/FilterBar';
import styles from './AppointmentsPage.module.css';
import type { Turno } from '../../../types/turno.types';
import { useAppointments } from '../hooks/useAppointments';
import { useAppointmentForm } from '../hooks/useAppointmentForm';
import { formatDate, formatTime } from '../../../utils/formatters';

const AppointmentsPage: React.FC = () => {
    // Custom Hooks
    const {
        turnos, loading, owners, pets, veterinarios, vetsOptions,
        searchTerm, setSearchTerm, filterFecha, setFilterFecha, filterVeterinario, setFilterVeterinario,
        handleCancel, handleDelete
    } = useAppointments();

    const {
        formData, errors, isAvailable, checkingAvailability, isEditing, formRef,
        handleChange, handleSubmit, handleEdit, resetForm
    } = useAppointmentForm();

    // Table Columns Definition
    const columns: Column<Turno>[] = [
        {
            header: 'Turno ID',
            accessor: (t) => <span className={styles.cellId}>#TRN-{t.id}</span>
        },
        {
            header: 'Mascota',
            accessor: (t) => (
                <div className={styles.cellMascota}>
                    <span className={styles.petName}>{t.mascota}</span>
                    <span className={styles.petIdBadge}>ID: {t.mascota_id}</span>
                </div>
            )
        },
        {
            header: 'Servicio',
            accessor: (t) => <span className={styles.textMuted}>{t.motivo}</span>
        },
        {
            header: 'Veterinario',
            accessor: (t) => <span className={styles.textGray}>{t.veterinario_nombre ? `Dr. ${t.veterinario_nombre}` : 'Sin asignar'}</span>
        },
        {
            header: 'Fecha',
            accessor: (t) => <span className={styles.textMuted}>{formatDate(t.fecha_hora)}</span>
        },
        {
            header: 'Hora',
            accessor: (t) => <span className={styles.textMuted}>{formatTime(t.fecha_hora)}</span>
        },
        {
            header: 'Estado',
            accessor: (t) => {
                let badgeClass = styles.statusPending;
                if (t.estado === 'confirmado' || t.estado === 'realizado') badgeClass = styles.statusConfirmed;
                if (t.estado === 'cancelado') badgeClass = styles.statusCancelled;

                return <span className={`${styles.statusBadge} ${badgeClass}`}>{t.estado}</span>
            }
        },
        {
            header: 'Acciones',
            accessor: (t) => (
                <div className={styles.actionsContainer}>
                    {t.estado === 'cancelado' ? (
                        <button onClick={() => handleDelete(t)} title="Eliminar Turno" className={styles.actionIcon}>
                            <span className={`material-icons ${styles.iconDelete}`}>delete</span>
                        </button>
                    ) : (
                        <>
                            <button onClick={() => handleEdit(t)} title="Editar Turno" className={styles.actionIcon}>
                                <span className={`material-icons ${styles.iconEdit}`}>edit</span>
                            </button>
                            <button onClick={() => handleCancel(t)} title="Cancelar Turno" className={styles.actionIcon}>
                                <span className={`material-icons ${styles.iconCancel}`}>cancel</span>
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div>
            {/* ENCABEZADO */}
            <header className={styles.pageHeader}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconBox}>
                        <span className={`material-icons ${styles.headerIcon}`}>calendar_today</span>
                    </div>
                    <div>
                        <h2 className={styles.pageTitle}>Turnos</h2>
                        <p className={styles.pageSubtitle}>Gestión de citas y servicios</p>
                    </div>
                </div>
                <span className={styles.headerBadge}>
                    Citas del Día
                </span>
            </header>

            {/* FORMULARIO */}
            <div ref={formRef} className={styles.formCard} style={{ borderLeft: isEditing ? '4px solid #6384FF' : 'none' }}>
                <h3 className={styles.formTitle}>
                    <span className="material-symbols-outlined">{isEditing ? 'edit_calendar' : 'event_available'}</span>
                    {isEditing ? 'Editar Turno' : 'Programar Nuevo Turno'}
                </h3>

                <div className={styles.grid}>
                    {!isEditing && (
                        <div className={`${styles.inputGroup} ${styles.span2}`}>
                            <label>ID Dueño</label>
                            <input
                                name="dueno_id"
                                value={formData.dueno_id}
                                onChange={handleChange}
                                type="text"
                                list="ownersList"
                                className={`${styles.inputField} ${errors.dueno_id ? styles.inputError : ''}`}
                                placeholder="#DW-..."
                                autoComplete="off"
                            />
                            <datalist id="ownersList">
                                {owners.map(o => (
                                    <option key={o.id} value={o.id}>{o.nombre} {o.apellido} (DNI: {o.dni || 'N/A'})</option>
                                ))}
                            </datalist>
                            {errors.dueno_id && <span className={styles.errorText}>{errors.dueno_id}</span>}
                        </div>
                    )}
                    <div className={`${styles.inputGroup} ${styles.span2}`}>
                        <label>ID Mascota</label>
                        <input
                            name="mascota_id"
                            value={formData.mascota_id}
                            onChange={handleChange}
                            type="text"
                            list="petsList"
                            className={`${styles.inputField} ${errors.mascota_id ? styles.inputError : ''}`}
                            placeholder="#PET-..."
                            autoComplete="off"
                        />
                        <datalist id="petsList">
                            {pets
                                .filter(p => !formData.dueno_id || p.dueno_id === Number(formData.dueno_id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} ({p.especie})</option>
                                ))}
                        </datalist>
                        {errors.mascota_id && <span className={styles.errorText}>{errors.mascota_id}</span>}
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span3}`}>
                        <label>Tipo de Servicio</label>
                        <select name="servicio_id" value={formData.servicio_id} onChange={handleChange} className={styles.inputField}>
                            <option value="1">Consulta General</option>
                            <option value="2">Vacunación</option>
                            <option value="3">Desparasitación</option>
                        </select>
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span3}`}>
                        <label>Veterinario ID</label>
                        <input
                            name="veterinario_id"
                            value={formData.veterinario_id}
                            onChange={handleChange}
                            type="text"
                            list="vetsList"
                            className={`${styles.inputField} ${errors.veterinario_id ? styles.inputError : ''}`}
                            placeholder="ID Vet"
                            autoComplete="off"
                        />
                        <datalist id="vetsList">
                            {veterinarios.map(v => (
                                <option key={v.id} value={v.id}>{v.nombre} {v.apellido} ({v.especialidad || 'General'})</option>
                            ))}
                        </datalist>
                        {errors.veterinario_id && <span className={styles.errorText}>{errors.veterinario_id}</span>}
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span2}`}>
                        <label>Fecha</label>
                        <input
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            type="date"
                            className={`${styles.inputField} ${errors.fecha ? styles.inputError : ''}`}
                        />
                        {errors.fecha && <span className={styles.errorText}>{errors.fecha}</span>}
                    </div>

                    {/* ROW 2 */}
                    <div className={`${styles.inputGroup} ${styles.span2}`}>
                        <label>Hora</label>
                        <input
                            name="hora"
                            value={formData.hora}
                            onChange={handleChange}
                            type="time"
                            className={`${styles.inputField} ${errors.hora ? styles.inputError : ''} ${isAvailable === true ? styles.inputSuccess : ''} ${isAvailable === false ? styles.inputError : ''}`}
                        />
                        {checkingAvailability && <span className={styles.infoText}>Comprobando...</span>}
                        {errors.availability && <span className={styles.errorText}>{errors.availability}</span>}
                        {isAvailable === true && !checkingAvailability && <span className={styles.successText}>Disponible</span>}
                        {errors.hora && <span className={styles.errorText}>{errors.hora}</span>}
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span5}`}>
                        <label>Motivo de Consulta</label>
                        <input
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                            type="text"
                            className={styles.inputField}
                            placeholder="Ej: Revisión post-operatoria"
                        />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.span3} ${styles.actionButtons}`}>
                        <button className={styles.submitBtn} onClick={handleSubmit}>
                            <span className="material-icons" style={{ fontSize: '1.25rem' }}>{isEditing ? 'save' : 'add_task'}</span>
                            {isEditing ? 'Actualizar' : 'Agendar'}
                        </button>
                        {isEditing && (
                            <button className={styles.cancelBtn} onClick={resetForm}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="material-icons" style={{ color: '#6384FF', fontSize: '1.25rem' }}>table_view</span>
                        <h3 className={styles.tableTitle}>Próximas Citas</h3>
                    </div>

                    <div className={styles.filterGroup}>
                        <input
                            type="date"
                            className={styles.inputField}
                            style={{ width: 'auto' }}
                            value={filterFecha}
                            onChange={(e) => setFilterFecha(e.target.value)}
                        />
                        <FilterBar
                            searchValue={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder="Buscar por mascota o vet..."
                            filters={[
                                {
                                    name: 'veterinario',
                                    label: 'Veterinario',
                                    value: filterVeterinario,
                                    options: vetsOptions
                                }
                            ]}
                            onFilterChange={(name: string, value: string) => {
                                if (name === 'veterinario') setFilterVeterinario(value);
                            }}
                        />
                    </div>
                </div>

                <GenericTable
                    columns={columns}
                    data={turnos}
                    keyExtractor={(t) => t.id}
                    emptyMessage={loading ? 'Cargando...' : 'No hay turnos registrados.'}
                />
            </div>
        </div>
    );
};

export default AppointmentsPage;
