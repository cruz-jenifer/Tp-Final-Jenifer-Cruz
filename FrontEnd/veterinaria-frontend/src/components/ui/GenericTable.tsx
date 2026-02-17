import React from 'react';
import styles from './GenericTable.module.css';

// INTERFAZ PARA DEFINIR LAS COLUMNAS DE LA TABLA
interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string; // PARA REDEFINICION MANUAL SI ES NECESARIO
}

// INTERFAZ PARA LAS ACCIONES DISPONIBLES EN CADA FILA
interface Action<T> {
    label?: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    className?: string;
    title?: string;
}

// PROPS DEL COMPONENTE TABLA GENERICA
interface GenericTableProps<T> {
    columns: Column<T>[];
    data: T[];
    actions?: Action<T>[];
    keyExtractor: (item: T) => string | number;
    isLoading?: boolean;
    emptyMessage?: string;
}

// COMPONENTE TABLA GENERICA REUTILIZABLE
function GenericTable<T>({
    columns,
    data,
    actions,
    keyExtractor,
    isLoading = false,
    emptyMessage = "NO HAY DATOS DISPONIBLES"
}: GenericTableProps<T>) {

    // ESTADO DE CARGA
    if (isLoading) {
        return <div className={styles.loadingContainer}>CARGANDO DATOS...</div>;
    }

    // ESTADO SIN DATOS
    if (!data || data.length === 0) {
        return <div className={styles.emptyContainer}>{emptyMessage}</div>;
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={`${styles.th} ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                        {actions && actions.length > 0 && (
                            <th scope="col" className={`${styles.th} ${styles.thRight}`}>
                                ACCIONES
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className={styles.tr}>
                            {columns.map((col, index) => (
                                <td key={index} className={styles.td}>
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                            {actions && actions.length > 0 && (
                                <td className={`${styles.td} ${styles.actionsCell}`}>
                                    <div className={styles.actionsContainer}>
                                        {actions.map((action, actionIndex) => (
                                            <button
                                                key={actionIndex}
                                                onClick={() => action.onClick(item)}
                                                className={`${styles.actionButton} ${action.className || ''}`}
                                                title={action.title}
                                            >
                                                {action.icon || action.label}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GenericTable;
