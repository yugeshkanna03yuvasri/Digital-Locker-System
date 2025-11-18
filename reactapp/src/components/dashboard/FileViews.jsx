import React, { useState } from 'react';
import { COLORS, formatFileSize, getFileTypes, filterAndSortFiles, paginateData } from './DashboardUtils';
import { FileIconByType } from './DashboardComponents';
import { SearchIcon, PlusIcon, UploadIcon, TrashIcon, FileTextIcon, FolderIcon, HistoryIcon, ZapIcon } from '../ui/Icons';

// Pagination Component with Security Card Colors
const PaginationButton = ({ pageNum, currentPage, onClick }) => (
    <button
        onClick={() => onClick(pageNum)}
        className={`px-3 py-1 border rounded text-sm ${
            currentPage === pageNum 
                ? '' 
                : 'hover:bg-gray-50'
        }`}
        style={currentPage === pageNum ? {
            background: `linear-gradient(to right, ${COLORS.cardGradientFrom}, ${COLORS.cardGradientTo})`,
            borderColor: COLORS.cardBorder,
            color: COLORS.primary,
            fontWeight: 'bold'
        } : {}}
    >
        {pageNum}
    </button>
);

// My Files View
export const MyFilesView = ({ 
    files, 
    folders, 
    currentFolder, 
    breadcrumb, 
    searchTerm, 
    setSearchTerm, 
    filterType, 
    setFilterType, 
    sortBy, 
    setSortBy, 
    sortOrder, 
    setSortOrder, 
    selectedFiles, 
    handleSelectFile, 
    handleSelectAll, 
    handleBulkDelete, 
    handleFolderClick, 
    handleBreadcrumbClick, 
    handleFileClick, 
    setIsNewFolderModalOpen, 
    fileInputRef, 
    handleFileUpload, 
    isUploading, 
    dragActive, 
    handleDrag, 
    handleDrop 
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const currentFolderId = currentFolder?.id || null;
    const allFiles = filterAndSortFiles(files, searchTerm, filterType, sortBy, sortOrder, currentFolderId);
    const currentFolders = folders.filter(folder => {
        const folderParentId = folder.parentFolder?.id || folder.parentId || null;
        return folderParentId === currentFolderId;
    });
    
    const paginatedFiles = paginateData(allFiles, currentPage, itemsPerPage);
    const currentFiles = paginatedFiles.data;
    
    return (
        <div 
            className={`bg-white p-6 rounded-xl shadow-md ring-1 ring-gray-100 ${dragActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {/* Breadcrumb Navigation */}
            <div className="mb-4">
                <nav className="flex items-center space-x-2 text-sm">
                    <button 
                        onClick={() => handleBreadcrumbClick(-1)}
                        className="transition"
                        style={{color: COLORS.primary}}
                        onMouseEnter={(e) => e.target.style.color = COLORS.primaryDark}
                        onMouseLeave={(e) => e.target.style.color = COLORS.primary}
                    >
                        Home
                    </button>
                    {breadcrumb.map((folder, index) => (
                        <React.Fragment key={folder.id}>
                            <span className="text-gray-400">/</span>
                            <button 
                                onClick={() => handleBreadcrumbClick(index)}
                                className="transition"
                                style={{color: COLORS.primary}}
                                onMouseEnter={(e) => e.target.style.color = COLORS.primaryDark}
                                onMouseLeave={(e) => e.target.style.color = COLORS.primary}
                            >
                                {folder.name}
                            </button>
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search files by name or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{'--tw-ring-color': COLORS.primary}}
                            onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                            onBlur={(e) => e.target.style.borderColor = ''}
                        />
                    </div>
                    
                    {/* Filter by Type */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{'--tw-ring-color': COLORS.primary}}
                        onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                        onBlur={(e) => e.target.style.borderColor = ''}
                    >
                        <option value="all">All Types</option>
                        {getFileTypes(files).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    
                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-');
                            setSortBy(field);
                            setSortOrder(order);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{'--tw-ring-color': COLORS.primary}}
                        onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                        onBlur={(e) => e.target.style.borderColor = ''}
                    >
                        <option value="uploadDate-desc">Newest First</option>
                        <option value="uploadDate-asc">Oldest First</option>
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                        <option value="size-desc">Largest First</option>
                        <option value="size-asc">Smallest First</option>
                    </select>
                </div>
            </div>

            {/* Header with Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold" style={{color: COLORS.textColor}}>
                    {currentFolder ? `${currentFolder.name} (${allFiles.length} files, ${currentFolders.length} folders)` : `My Files (${allFiles.length} files, ${currentFolders.length} folders)`}
                </h2>
                
                <div className="flex gap-3">
                    {selectedFiles.length > 0 && (
                        <>
                            <span className="text-sm text-gray-600 self-center">
                                {selectedFiles.length} selected
                            </span>
                            <button 
                                onClick={handleBulkDelete}
                                className="flex items-center px-4 py-2 rounded-lg font-semibold text-white transition shadow-md bg-red-500 hover:bg-red-600"
                            >
                                <TrashIcon className="h-5 w-5 mr-2" />
                                Delete Selected
                            </button>
                        </>
                    )}
                    <button 
                        onClick={() => setIsNewFolderModalOpen(true)}
                        className="flex items-center px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 shadow-md"
                        style={{
                            backgroundColor: COLORS.primary,
                            boxShadow: `0 4px 15px rgba(102, 34, 34, 0.3)`
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = COLORS.primaryDark;
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = COLORS.primary;
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        New Folder
                    </button>
                    
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                    <button 
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 shadow-md disabled:opacity-50"
                        style={{
                            backgroundColor: COLORS.primary,
                            boxShadow: `0 4px 15px rgba(102, 34, 34, 0.3)`
                        }}
                        onMouseEnter={(e) => {
                            if (!isUploading) {
                                e.target.style.backgroundColor = COLORS.primaryDark;
                                e.target.style.transform = 'translateY(-2px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isUploading) {
                                e.target.style.backgroundColor = COLORS.primary;
                                e.target.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        <UploadIcon className="h-5 w-5 mr-2" />
                        {isUploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </div>
            </div>

            {/* Drag and Drop Zone */}
            {dragActive && (
                <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50 pointer-events-none" style={{backgroundColor: `${COLORS.primary}33`}}>
                    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-dashed" style={{borderColor: COLORS.primary}}>
                        <UploadIcon className="h-12 w-12 mx-auto mb-4" style={{color: COLORS.primary}} />
                        <p className="text-xl font-semibold" style={{color: COLORS.primary}}>Drop files here to upload</p>
                    </div>
                </div>
            )}

            {/* Folders Section */}
            {currentFolders.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3" style={{color: COLORS.textColor}}>Folders</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {currentFolders.map(folder => (
                            <div 
                                key={folder.id} 
                                className="relative p-4 border rounded-lg hover:shadow-md transition cursor-pointer bg-gradient-to-br" 
                                style={{
                                    background: `linear-gradient(to bottom right, ${COLORS.cardGradientFrom}, ${COLORS.cardGradientTo})`,
                                    borderColor: COLORS.cardBorder
                                }}
                                onClick={() => handleFolderClick(folder)}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                {/* Red Lock Icon - Top Right */}
                                {folder.isPasswordProtected && (
                                    <div className="lock-icon absolute top-2 right-2 z-10">
                                        <svg className="w-5 h-5" style={{color: '#e53935'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                )}
                                <FolderIcon className="h-8 w-8 mb-2" style={{color: COLORS.primary}} />
                                <p className="font-medium text-sm" style={{color: COLORS.textColor}}>{folder.name}</p>
                                <p className="text-xs text-gray-500">{new Date(folder.createdAt || folder.createdDate || Date.now()).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        
            {/* Files Section */}
            <div className="overflow-x-auto min-h-[400px]">
                {currentFiles.length === 0 && currentFolders.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <FileTextIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                        <p>{currentFolder ? `This folder is empty. Start by uploading files or creating folders.` : `No files uploaded yet. Start by clicking "Upload File".`}</p>
                    </div>
                ) : currentFiles.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <FileTextIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                        <p>No files in this folder. Upload some files to get started.</p>
                    </div>
                ) : (
                    <table className="min-w-full text-left border-collapse">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-4 font-medium text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.length === currentFiles.length && currentFiles.length > 0}
                                        onChange={handleSelectAll}
                                        className="mr-2"
                                    />
                                    File Name
                                </th>
                                <th className="p-4 font-medium text-gray-600">Type</th>
                                <th className="p-4 font-medium text-gray-600 cursor-pointer hover:text-sage-600" 
                                    onClick={() => {
                                        setSortBy('size');
                                        setSortOrder(sortBy === 'size' && sortOrder === 'desc' ? 'asc' : 'desc');
                                    }}>
                                    Size {sortBy === 'size' && (sortOrder === 'desc' ? '↓' : '↑')}
                                </th>
                                <th className="p-4 font-medium text-gray-600 cursor-pointer hover:text-sage-600"
                                    onClick={() => {
                                        setSortBy('uploadDate');
                                        setSortOrder(sortBy === 'uploadDate' && sortOrder === 'desc' ? 'asc' : 'desc');
                                    }}>
                                    Date {sortBy === 'uploadDate' && (sortOrder === 'desc' ? '↓' : '↑')}
                                </th>
                                <th className="p-4 font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFiles.map(file => (
                                <tr key={file.id} className={`border-b hover:bg-gray-50 transition duration-150 cursor-pointer ${
                                    selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                                }`}>
                                    <td className="p-4 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedFiles.includes(file.id)}
                                            onChange={() => handleSelectFile(file.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="mr-2"
                                        />
                                        <div onClick={() => handleFileClick(file)} className="flex items-center gap-3">
                                            {file.isPasswordProtected && (
                                                <svg className="w-4 h-4" style={{color: '#e53935'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            )}
                                            <FileIconByType type={file.fileType} fileName={file.name || file.fileName} />
                                            <div>
                                                <p className="font-semibold" style={{color: COLORS.textColor}}>
                                                    {file.name || file.fileName}
                                                </p>
                                                {file.tags && file.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {file.tags.slice(0, 3).map(tag => (
                                                            <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4" style={{color: COLORS.textColor}}>{file.fileType}</td>
                                    <td className="p-4" style={{color: COLORS.textColor}}>{formatFileSize(file.size || file.fileSize)}</td>
                                    <td className="p-4" style={{color: COLORS.textColor}}>
                                        {new Date(file.uploadedAt || file.uploadDate || Date.now()).toLocaleDateString()}
                                        {file.expiryDate && (
                                            <div className="text-xs text-orange-600 mt-1">
                                                Expires: {new Date(file.expiryDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleFileClick(file); }}
                                            className="text-sm px-3 py-1 rounded-full font-medium transition"
                                            style={{backgroundColor: COLORS.mint, color: COLORS.mintText}}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* Pagination at bottom */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                    </select>
                </div>
                
                {paginatedFiles.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        
                        {Array.from({length: Math.min(5, paginatedFiles.totalPages)}, (_, i) => {
                            const pageNum = i + Math.max(1, currentPage - 2);
                            if (pageNum > paginatedFiles.totalPages) return null;
                            return (
                                <PaginationButton
                                    key={pageNum}
                                    pageNum={pageNum}
                                    currentPage={currentPage}
                                    onClick={setCurrentPage}
                                />
                            );
                        })}
                        
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === paginatedFiles.totalPages}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// History View
export const HistoryView = ({ files }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const paginatedFiles = paginateData(files, currentPage, itemsPerPage);
    const currentFiles = paginatedFiles.data;
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md ring-1 ring-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold" style={{color: COLORS.textColor}}>Upload History ({files.length} files)</h2>
            </div>
            
            <div className="overflow-x-auto min-h-[400px]">
                {files.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <HistoryIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                        <p>No upload history found.</p>
                    </div>
                ) : (
                    <table className="min-w-full text-left border-collapse">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="p-4 font-medium text-gray-600">File Name</th>
                                <th className="p-4 font-medium text-gray-600">Type</th>
                                <th className="p-4 font-medium text-gray-600">Size</th>
                                <th className="p-4 font-medium text-gray-600">Upload Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFiles.map(file => (
                                <tr key={file.id} className="border-b hover:bg-gray-50 transition duration-150">
                                    <td className="p-4 flex items-center gap-3">
                                        {file.isPasswordProtected && (
                                            <svg className="w-4 h-4" style={{color: '#e53935'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        )}
                                        <FileIconByType type={file.fileType} fileName={file.name || file.fileName} />
                                        <p className="font-semibold" style={{color: COLORS.textColor}}>{file.name || file.fileName}</p>
                                    </td>
                                    <td className="p-4" style={{color: COLORS.textColor}}>{file.fileType}</td>
                                    <td className="p-4" style={{color: COLORS.textColor}}>{formatFileSize(file.size || file.fileSize)}</td>
                                    <td className="p-4" style={{color: COLORS.textColor}}>{new Date(file.uploadedAt || file.uploadDate || Date.now()).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            {/* Pagination at bottom */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                    </select>
                </div>
                
                {paginatedFiles.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        
                        {Array.from({length: Math.min(5, paginatedFiles.totalPages)}, (_, i) => {
                            const pageNum = i + Math.max(1, currentPage - 2);
                            if (pageNum > paginatedFiles.totalPages) return null;
                            return (
                                <PaginationButton
                                    key={pageNum}
                                    pageNum={pageNum}
                                    currentPage={currentPage}
                                    onClick={setCurrentPage}
                                />
                            );
                        })}
                        
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === paginatedFiles.totalPages}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Activity Logs View
export const ActivityLogView = ({ activityLogs }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const paginatedLogs = paginateData(activityLogs, currentPage, itemsPerPage);
    const currentLogs = paginatedLogs.data;
    
    const formatActivityDetails = (log) => {
        const details = log.details || {};
        let description = '';
        
        switch (log.action) {
            case 'UPLOAD':
                description = `Uploaded file: ${details.fileName || 'Unknown file'}`;
                if (details.fileSize) description += ` (${details.fileSize})`;
                break;
            case 'DOWNLOAD':
                description = `Downloaded file: ${details.fileName || 'Unknown file'}`;
                break;
            case 'DELETE':
                description = `Deleted file: ${details.fileName || 'Unknown file'}`;
                break;
            case 'RENAME':
                description = `Renamed file from "${details.oldName || 'Unknown'}" to "${details.newName || details.fileName || 'Unknown'}"`;
                break;
            case 'VIEW':
                description = `Viewed file: ${details.fileName || 'Unknown file'}`;
                break;
            case 'CREATE_FOLDER':
                description = `Created folder: ${details.folderName || 'Unknown folder'}`;
                break;
            case 'OPEN_FOLDER':
                description = `Opened folder: ${details.folderName || 'Unknown folder'}`;
                break;
            default:
                description = `${log.action}: ${details.fileName || details.folderName || 'Unknown item'}`;
        }
        
        return description;
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'DELETE': return 'text-red-600';
            case 'UPLOAD': case 'CREATE_FOLDER': return 'text-green-600';
            case 'DOWNLOAD': case 'VIEW': return 'text-blue-600';
            case 'RENAME': return 'text-orange-600';
            case 'OPEN_FOLDER': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };

    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md ring-1 ring-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold" style={{color: COLORS.textColor}}>Activity Logs ({activityLogs.length} activities)</h2>
            </div>
            
            <div className="overflow-x-auto min-h-[400px]">
                {activityLogs.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <ZapIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                        <p>No activity logs found. Start interacting with your files!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentLogs.length > 0 ? currentLogs.map(log => (
                            <div key={log.id || Math.random()} className="p-4 border rounded-lg hover:bg-gray-50 transition duration-150">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-semibold text-sm px-2 py-1 rounded-full bg-gray-100 ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </div>
                                        <p className="text-sm" style={{color: COLORS.textColor}}>
                                            {formatActivityDetails(log)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {formatTimestamp(log.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500">
                                <ZapIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                                <p>No activity logs yet. Upload, view, or modify files to see activity here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {/* Pagination at bottom */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                    </select>
                </div>
                
                {paginatedLogs.totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        
                        {Array.from({length: Math.min(5, paginatedLogs.totalPages)}, (_, i) => {
                            const pageNum = i + Math.max(1, currentPage - 2);
                            if (pageNum > paginatedLogs.totalPages) return null;
                            return (
                                <PaginationButton
                                    key={pageNum}
                                    pageNum={pageNum}
                                    currentPage={currentPage}
                                    onClick={setCurrentPage}
                                />
                            );
                        })}
                        
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === paginatedLogs.totalPages}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};