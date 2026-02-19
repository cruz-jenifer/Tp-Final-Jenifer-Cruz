import React, { useState } from 'react';
import styles from './GenericTable.module.css';

// INTERFAZ PARA DEFINIR LAS COLUMNAS DE LA TABLA
export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string; // PARA REDEFINICION MANUAL SI ES NECESARIO
}

// INTERFAZ PARA LAS ACCIONES DISPONIBLES EN CADA FILA
export interface Action<T> {
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
    pageSize?: number; // TAMAÑO DE PAGINA (DEFAULT 10)
}

// COMPONENTE TABLA GENERICA REUTILIZABLE
function GenericTable<T>({
    columns,
    data,
    actions,
    keyExtractor,
    isLoading = false,
    emptyMessage = "NO HAY DATOS DISPONIBLES",
    pageSize = 10
}: GenericTableProps<T>) {

    // ESTADO DE PAGINACION
    const [currentPage, setCurrentPage] = useState(1);

    // ESTADO DE CARGA
    if (isLoading) {
        return <div className={styles.loadingContainer}>CARGANDO DATOS...</div>;
    }

    // ESTADO SIN DATOS
    if (!data || data.length === 0) {
        return <div className={styles.emptyContainer}>{emptyMessage}</div>;
    }

    // CALCULAR PAGINACION
    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    // AJUSTAR PAGINA SI DATA CAMBIA Y PAGINA ACTUAL ES INVALIDA
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    // GENERAR NUMEROS DE PAGINA VISIBLES
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

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
                    {paginatedData.map((item) => (
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

            {/* BARRA DE PAGINACION */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.paginationInfo}>
                        {startIndex + 1}-{Math.min(endIndex, data.length)} de {data.length}
                    </span>
                    <div className={styles.paginationButtons}>
                        <button
                            className={styles.pageButton}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <span className="material-icons" style={{ fontSize: '1.1rem' }}>chevron_left</span>
                        </button>
                        {getPageNumbers().map((page, i) => (
                            typeof page === 'number' ? (
                                <button
                                    key={i}
                                    className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={i} className={styles.pageEllipsis}>...</span>
                            )
                        ))}
                        <button
                            className={styles.pageButton}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <span className="material-icons" style={{ fontSize: '1.1rem' }}>chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenericTable;
