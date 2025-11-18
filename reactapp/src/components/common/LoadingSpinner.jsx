import React from 'react';
import { STYLES, SIZES } from '../../styles/constants';

const LoadingSpinner = ({ 
    size = 'md', 
    className = '',
    text = 'Loading...'
}) => {
    const sizeClasses = {
        sm: SIZES.icon.sm,
        md: SIZES.icon.lg,
        lg: SIZES.icon.xl
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`${STYLES.loading} ${sizeClasses[size]} mr-2`} />
            {text && <span className="text-gray-600">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;