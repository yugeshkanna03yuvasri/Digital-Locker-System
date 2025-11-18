import React from 'react';
import { STYLES } from '../../styles/constants';

const StatusBadge = ({ 
    status, 
    className = '',
    children 
}) => {
    const statusClasses = {
        active: STYLES.statusActive,
        inactive: STYLES.statusInactive,
        success: 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium',
        warning: 'px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium',
        error: 'px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium',
        info: 'px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'
    };

    const badgeClass = `${statusClasses[status] || statusClasses.info} ${className}`.trim();

    return (
        <span className={badgeClass}>
            {children || status}
        </span>
    );
};

export default StatusBadge;