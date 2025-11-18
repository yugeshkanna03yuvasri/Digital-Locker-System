import React from 'react';
import { STYLES, SIZES } from '../../styles/constants';

const Input = ({ 
    label,
    error,
    icon: Icon,
    className = '',
    ...props 
}) => {
    const inputClass = `
        ${STYLES.input}
        ${Icon ? 'pl-10' : ''}
        ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        ${className}
    `.trim();
    
    return (
        <div className="mb-4">
            {label && (
                <label className={STYLES.label}>
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${SIZES.icon.sm}`} />
                )}
                <input
                    className={inputClass}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;