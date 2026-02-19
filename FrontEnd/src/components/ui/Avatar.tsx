import React from 'react';
import styles from './Avatar.module.css';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type AvatarVariant = 'primary' | 'orange' | 'blue' | 'green' | 'gray';

interface AvatarProps {
    src?: string;
    alt?: string;
    initials?: string;
    icon?: string;
    size?: AvatarSize;
    variant?: AvatarVariant;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    initials,
    icon,
    size = 'md',
    variant = 'primary',
    className = ''
}) => {
    return (
        <div
            className={`${styles.avatar} ${styles[size]} ${styles[variant]} ${className}`}
            role="img"
            aria-label={alt || 'Avatar'}
        >
            {src ? (
                <img src={src} alt={alt} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : icon ? (
                <span className="material-icons" style={{ fontSize: 'inherit' }}>{icon}</span>
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};
