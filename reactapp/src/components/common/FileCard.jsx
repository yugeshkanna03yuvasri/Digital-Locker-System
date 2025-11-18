import React from 'react';
import { STYLES, SIZES } from '../../styles/constants';
import { FileIcon, FolderIcon, LockIcon } from '../ui/Icons';
import { StatusBadge } from './';

const FileCard = ({ 
    item, 
    isFolder = false, 
    onClick, 
    onSelect,
    isSelected = false,
    showActions = true,
    className = ''
}) => {
    const cardClass = `
        ${isFolder ? STYLES.folderCard : STYLES.fileCard}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        cursor-pointer
        ${className}
    `.trim();

    const handleClick = (e) => {
        if (e.target.type === 'checkbox') return;
        onClick?.(item);
    };

    return (
        <div className={cardClass} onClick={handleClick}>
            <div className={STYLES.flexBetween}>
                <div className="flex items-center gap-3">
                    {onSelect && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onSelect(item.id, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    )}
                    
                    <div className="flex items-center gap-2">
                        {isFolder ? (
                            <FolderIcon className={`${SIZES.icon.lg} text-blue-600`} />
                        ) : (
                            <FileIcon className={`${SIZES.icon.lg} text-gray-600`} />
                        )}
                        
                        {item.isPasswordProtected && (
                            <LockIcon className={`${SIZES.icon.sm} text-yellow-600`} />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                            {item.name || item.fileName}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {isFolder 
                                ? `Created ${new Date(item.createdAt).toLocaleDateString()}`
                                : `${item.fileSize || 'Unknown size'} • ${new Date(item.uploadedAt || item.createdAt).toLocaleDateString()}`
                            }
                        </p>
                    </div>
                </div>
                
                {showActions && (
                    <div className="flex items-center gap-2">
                        {item.status && (
                            <StatusBadge status={item.status} />
                        )}
                        
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                            <svg className={SIZES.icon.sm} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileCard;