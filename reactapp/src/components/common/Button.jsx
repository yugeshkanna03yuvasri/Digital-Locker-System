import React from 'react';
import { STYLES, SIZES } from '../../styles/constants';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    onClick, 
    className = '',
    icon: Icon,
    loading = false,
    ...props 
}) => {
    const baseClass = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500',
        ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500'
    };
    
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    
    const disabledClass = 'opacity-50 cursor-not-allowed';
    
    const buttonClass = `
        ${baseClass}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledClass : ''}
        ${className}
    `.trim();
    
    return (
        <button
            className={buttonClass}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading ? (
                <div className={`${STYLES.loading} ${SIZES.icon.sm} mr-2`} />
            ) : (
                Icon && <Icon className={`${SIZES.icon.sm} mr-2`} />
            )}
            {children}
        </button>
    );
};

export default Button;