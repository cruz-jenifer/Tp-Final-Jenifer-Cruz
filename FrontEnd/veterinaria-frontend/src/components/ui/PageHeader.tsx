import React from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: string; // Material Icon name
    badgeText?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, badgeText }) => {
    return (
        <div className={styles.sectionHeader}>
            <div className={styles.titleGroup}>
                <div className={styles.iconBox}>
                    <span className="material-icons" style={{ fontSize: '1.875rem' }}>{icon}</span>
                </div>
                <div>
                    <h2 className={styles.pageTitle}>{title}</h2>
                    {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
                </div>
            </div>
            {badgeText && (
                <span className={styles.activeBadge}>
                    {badgeText}
                </span>
            )}
        </div>
    );
};

export default PageHeader;
