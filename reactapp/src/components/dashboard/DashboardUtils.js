import React from 'react';
import { COLORS, STYLES } from '../../styles/constants';

// Re-export colors for backward compatibility
export { COLORS };

// Format file size
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file type based on extension
export const getFileType = (fileName) => {
    if (!fileName) return 'Unknown';
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const documentTypes = ['doc', 'docx', 'txt', 'rtf', 'odt'];
    const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
    
    if (extension === 'pdf') return 'PDF';
    if (imageTypes.includes(extension)) return 'Image';
    if (documentTypes.includes(extension)) return 'Document';
    if (archiveTypes.includes(extension)) return 'Archive';
    
    return 'Other';
};

// Get unique file types for filter dropdown
export const getFileTypes = (files) => {
    const types = [...new Set(files.map(f => f.fileType).filter(Boolean))];
    return types.sort();
};

// Filter and sort files
export const filterAndSortFiles = (files, searchTerm, filterType, sortBy, sortOrder, currentFolderId) => {
    // Filter files by folder
    let filteredFiles = files.filter(file => {
        const fileFolderId = file.parentFolder?.id || file.folderId || null;
        return fileFolderId === currentFolderId;
    });
    
    // Apply search filter
    if (searchTerm) {
        filteredFiles = filteredFiles.filter(file => 
            (file.name || file.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (file.fileType || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
        filteredFiles = filteredFiles.filter(file => 
            (file.fileType || '').toLowerCase() === filterType.toLowerCase()
        );
    }
    
    // Apply sorting
    filteredFiles.sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
            case 'name':
                aVal = (a.name || a.fileName || '').toLowerCase();
                bVal = (b.name || b.fileName || '').toLowerCase();
                break;
            case 'size':
                aVal = a.size || a.fileSize || 0;
                bVal = b.size || b.fileSize || 0;
                break;
            case 'uploadDate':
            default:
                aVal = new Date(a.uploadedAt || a.uploadDate || 0).getTime();
                bVal = new Date(b.uploadedAt || b.uploadDate || 0).getTime();
                break;
        }
        
        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    return filteredFiles;
};

// Pagination utility
export const paginateData = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
        data: data.slice(startIndex, endIndex),
        totalPages: Math.ceil(data.length / itemsPerPage),
        totalItems: data.length,
        currentPage,
        itemsPerPage
    };
};

// Pagination component
export const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    // Always show pagination controls when there are items
    if (totalPages <= 0) return null;
    
    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select 
                    value={itemsPerPage} 
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                </select>
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Previous
                </button>
                
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`px-3 py-1 border rounded text-sm ${
                            currentPage === number 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'hover:bg-gray-50'
                        }`}
                    >
                        {number}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};