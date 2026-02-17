import React from 'react';
import styles from './PageHeader.module.css';

// PROPS DEL COMPONENTE ENCABEZADO DE PAGINA
interface PageHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

// COMPONENTE ENCABEZADO DE PAGINA REUTILIZABLE
const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    actionLabel,
    onAction,
    icon
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    {title}
                </h1>
                {description && (
                    <p className={styles.description}>
                        {description}
                    </p>
                )}
            </div>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className={styles.actionButton}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default PageHeader;
