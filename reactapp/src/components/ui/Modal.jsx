import React from 'react';
import { STYLES } from '../../styles/constants';
import { XIcon } from '../ui/Icons';

const Modal = ({ 
    title, 
    children, 
    onClose, 
    isOpen, 
    size = 'md',
    showCloseButton = true,
    className = ''
}) => {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div 
            className={`${STYLES.modal} p-4`}
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-xl shadow-2xl ${sizes[size]} w-full transform transition-all overflow-hidden ${className}`}
                onClick={e => e.stopPropagation()}
            >
                {title && (
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-blue-600">
                            {title}
                        </h3>
                        {showCloseButton && (
                            <button 
                                onClick={onClose} 
                                className="text-gray-600 hover:text-red-500 p-2 rounded-full transition-colors"
                            >
                                <XIcon className="h-6 w-6" />
                            </button>
                        )}
                    </div>
                )}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;