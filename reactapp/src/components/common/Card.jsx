import React from 'react';
import { STYLES } from '../../styles/constants';

const Card = ({ 
    children, 
    className = '', 
    padding = 'p-6',
    shadow = 'shadow-md',
    hover = false,
    ...props 
}) => {
    const baseClass = 'bg-white rounded-lg';
    const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
    
    const cardClass = `${baseClass} ${shadow} ${padding} ${hoverClass} ${className}`.trim();
    
    return (
        <div className={cardClass} {...props}>
            {children}
        </div>
    );
};

export default Card;