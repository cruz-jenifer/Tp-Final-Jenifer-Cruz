import React from 'react';
import styles from './RegisterCard.module.css';

interface RegisterCardProps {
    title: string;
    icon: string; // Material Icon Name
    children: React.ReactNode;
}

export const RegisterCard: React.FC<RegisterCardProps> = ({ title, icon, children }) => {
    return (
        <div className={styles.registerCard}>
            <div className={styles.cardCircleDeco}></div>
            <h3 className={styles.cardTitle}>
                <span className="material-icons">{icon}</span>
                {title}
            </h3>
            {children}
        </div>
    );
};

export default RegisterCard;
