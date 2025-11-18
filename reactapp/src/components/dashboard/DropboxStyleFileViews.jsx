import React, { useState } from 'react';
import { COLORS, formatFileSize, getFileTypes, filterAndSortFiles, paginateData } from './DashboardUtils';
import { FileIconByType } from './DashboardComponents';

// Modern SVG Icons
const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const GridIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const ListIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const PlusIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const UploadIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const FolderIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const DotsIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

const HistoryIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ZapIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

// Dropbox-style File Card Component
const FileCard = ({ file, isSelected, onSelect, onClick, onMenuClick }) => (
    <div 
        className={`group relative bg-white border rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
            isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300 shadow-sm'
        }`}
        onClick={onClick}
    >
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
        </div>

        {/* Menu Button */}
        <button
            onClick={(e) => { e.stopPropagation(); onMenuClick(); }}
            className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-100 transition-opacity"
        >
            <DotsIcon className="w-4 h-4 text-gray-500" />
        </button>



        {/* File Icon */}
        <div className="p-6 flex flex-col items-center">
            <div className="mb-4">
                <FileIconByType type={file.fileType} fileName={file.name || file.fileName} size="large" />
            </div>
            
            {/* File Name */}
            <div className="flex items-center justify-center mb-1">
                <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2">
                    {file.name || file.fileName}
                </h3>
            </div>
            
            {/* File Details */}
            <div className="text-xs text-gray-500 text-center space-y-1">
                <div>{formatFileSize(file.size || file.fileSize)}</div>
                <div>{new Date(file.uploadedAt || file.uploadDate || Date.now()).toLocaleDateString()}</div>
            </div>
        </div>
    </div>
);

// Dropbox-style Folder Card Component
const FolderCard = ({ folder, onClick, onDelete, isSelected, onSelect, onSetPassword }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    
    return (
        <div 
            className={`group bg-white border rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 shadow-sm relative ${
                isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onClick(folder)}
        >
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
            </div>
            
            {/* Context Menu Button */}
            <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowContextMenu(!showContextMenu);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-100 transition-opacity"
                >
                    <DotsIcon className="w-4 h-4 text-gray-500" />
                </button>
                
                {/* Context Menu */}
                {showContextMenu && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSetPassword(folder);
                                setShowContextMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            {folder.isPasswordProtected ? 'Update Password' : 'Set Password'}
                        </button>
                    </div>
                )}
            </div>
            


            <div className="p-6 flex flex-col items-center">
                <div className="mb-4">
                    <FolderIcon className="w-12 h-12" style={{color: COLORS.primary}} />
                </div>
                <div className="flex items-center justify-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900 text-center">
                        {folder.name}
                    </h3>
                </div>
                <div className="text-xs text-gray-500">
                    {new Date(folder.createdAt || folder.createdDate || Date.now()).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

// Modern Dropbox-style My Files View
// Dropbox-style My Files View
export const DropboxMyFilesView = ({ 
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
    handleDrop,
    fileFilter = 'all',
    handleFolderDelete,
    selectedFolders,
    handleSelectFolder,
    handleBulkFolderDelete
}) => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    
    const currentFolderId = currentFolder?.id || null;
    
    // Filter files based on file type filter
    const getFilteredFiles = () => {
        let filteredFiles = files;
        
        // Apply file type filter
        if (fileFilter !== 'all') {
            switch (fileFilter) {
                case 'photos':
                    filteredFiles = files.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
                    });
                    break;
                case 'documents':
                    filteredFiles = files.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
                    });
                    break;
                case 'videos':
                    filteredFiles = files.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext);
                    });
                    break;
                case 'audio':
                    filteredFiles = files.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext);
                    });
                    break;
                default:
                    filteredFiles = files;
            }
        }
        
        return filteredFiles;
    };
    
    const allFiles = fileFilter === 'folders' ? [] : filterAndSortFiles(getFilteredFiles(), searchTerm, filterType, sortBy, sortOrder, currentFolderId);
    const currentFolders = (fileFilter === 'folders' || fileFilter === 'all') ? folders.filter(folder => {
        const folderParentId = folder.parentFolder?.id || folder.parentId || null;
        return folderParentId === currentFolderId;
    }) : [];
    
    const paginatedFolders = paginateData(currentFolders, currentPage, itemsPerPage);
    const displayFolders = fileFilter === 'folders' ? paginatedFolders.data : currentFolders;
    
    const paginatedFiles = paginateData(allFiles, currentPage, itemsPerPage);
    const currentFiles = paginatedFiles.data;
    
    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header Section */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                {/* Breadcrumb */}
                <div className="px-6 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <button 
                            onClick={() => handleBreadcrumbClick(-1)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </button>
                        {breadcrumb.map((folder, index) => (
                            <React.Fragment key={folder.id}>
                                <span className="text-gray-400">/</span>
                                <button 
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition"
                                >
                                    {folder.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </nav>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Left side - Search and filters */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
                            {/* Search */}
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search in files"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            
                            {/* Filters */}
                            <div className="flex gap-2">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="all">All types</option>
                                    {getFileTypes(files).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] = e.target.value.split('-');
                                        setSortBy(field);
                                        setSortOrder(order);
                                    }}
                                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                >
                                    <option value="uploadDate-desc">Date modified</option>
                                    <option value="name-asc">Name A-Z</option>
                                    <option value="name-desc">Name Z-A</option>
                                    <option value="size-desc">Size (largest)</option>
                                    <option value="size-asc">Size (smallest)</option>
                                </select>
                            </div>
                        </div>

                        {/* Right side - Actions and view toggle */}
                        <div className="flex items-center gap-3">
                            {/* Selection info */}
                            {(selectedFiles.length > 0 || selectedFolders?.length > 0) && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">
                                        {selectedFiles.length + (selectedFolders?.length || 0)} selected
                                    </span>
                                    {selectedFiles.length > 0 && (
                                        <button 
                                            onClick={handleBulkDelete}
                                            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
                                        >
                                            Delete Files
                                        </button>
                                    )}
                                    {selectedFolders?.length > 0 && (
                                        <button 
                                            onClick={handleBulkFolderDelete}
                                            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
                                        >
                                            Delete Folders
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Action buttons */}
                            <button 
                                onClick={() => setIsNewFolderModalOpen(true)}
                                className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                New folder
                            </button>
                            
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
                            <button 
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition disabled:opacity-50 shadow-md hover:shadow-lg"
                                style={{backgroundColor: COLORS.primary}}
                            >
                                <UploadIcon className="h-4 w-4 mr-2" />
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </button>

                            {/* View toggle */}
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <GridIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <ListIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div 
                className={`flex-1 p-6 overflow-y-auto ${dragActive ? 'bg-blue-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Drag overlay */}
                {dragActive && (
                    <div className="fixed inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center z-50 pointer-events-none">
                        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-dashed border-blue-500">
                            <UploadIcon className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                            <p className="text-xl font-semibold text-blue-600">Drop files here to upload</p>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {(fileFilter === 'folders' ? currentFolders.length === 0 : (currentFiles.length === 0 && currentFolders.length === 0)) ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FolderIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {fileFilter === 'folders' 
                                ? 'No folders found' 
                                : currentFolder 
                                    ? 'This folder is empty' 
                                    : 'No files yet'
                            }
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            {fileFilter === 'folders'
                                ? 'Create your first folder to organize your files.'
                                : currentFolder 
                                    ? 'Add files by uploading or creating new folders.' 
                                    : 'Upload your first file or create a folder to get started.'
                            }
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsNewFolderModalOpen(true)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Create folder
                            </button>
                            {fileFilter !== 'folders' && (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 text-sm font-medium text-white rounded-lg"
                                    style={{backgroundColor: COLORS.primary}}
                                >
                                    Upload files
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Folders Section */}
                        {fileFilter === 'folders' && currentFolders.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                                    Folders ({currentFolders.length})
                                </h3>
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {displayFolders.map(folder => (
                                            <FolderCard
                                                key={folder.id}
                                                folder={folder}
                                                onClick={handleFolderClick}
                                                onDelete={handleFolderDelete}
                                                isSelected={selectedFolders?.includes(folder.id)}
                                                onSelect={() => handleSelectFolder?.(folder.id)}
                                                onSetPassword={(folder) => {
                                                    if (window.onShowFolderPasswordModal) {
                                                        window.onShowFolderPasswordModal(folder);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Size
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Protection
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Created
                                                    </th>
                                                    <th className="relative px-6 py-3">
                                                        <span className="sr-only">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {displayFolders.map(folder => (
                                                    <tr 
                                                        key={folder.id} 
                                                        className="hover:bg-gray-50 cursor-pointer"
                                                        onClick={() => handleFolderClick(folder)}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFolders?.includes(folder.id)}
                                                                onChange={() => handleSelectFolder?.(folder.id)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-4 h-4 text-orange-600 rounded border-gray-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FolderIcon className="w-6 h-6 mr-3" style={{color: COLORS.primary}} />
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {folder.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            —
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {folder.isPasswordProtected ? (
                                                                <svg className="w-4 h-4" style={{color: '#e53935'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(folder.createdAt || folder.createdDate || Date.now()).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {/* No actions for folders */}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Folders Section for All Files in Grid View */}
                        {fileFilter === 'all' && viewMode === 'grid' && currentFolders.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Folders ({currentFolders.length})
                                    </h3>
                                    {selectedFolders?.length > 0 && (
                                        <button
                                            onClick={handleBulkFolderDelete}
                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete Selected ({selectedFolders.length})
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {currentFolders.map(folder => (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            onClick={handleFolderClick}
                                            onDelete={handleFolderDelete}
                                            isSelected={selectedFolders?.includes(folder.id)}
                                            onSelect={() => handleSelectFolder?.(folder.id)}
                                            onSetPassword={(folder) => {
                                                if (window.onShowFolderPasswordModal) {
                                                    window.onShowFolderPasswordModal(folder);
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files Section */}
                        {fileFilter !== 'folders' && currentFiles.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Files ({allFiles.length})
                                    </h3>
                                    {allFiles.length > 0 && (
                                        <button
                                            onClick={() => {
                                                if (selectedFiles.length === allFiles.length && allFiles.length > 0) {
                                                    // Deselect all
                                                    handleSelectFile('deselect-all');
                                                } else {
                                                    // Select all
                                                    handleSelectAll();
                                                }
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            {selectedFiles.length === allFiles.length && allFiles.length > 0 
                                                ? 'Deselect all' 
                                                : 'Select all'
                                            }
                                        </button>
                                    )}
                                </div>

                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {currentFiles.map(file => (
                                            <FileCard
                                                key={file.id}
                                                file={file}
                                                isSelected={selectedFiles.includes(file.id)}
                                                onSelect={() => handleSelectFile(file.id)}
                                                onClick={() => {
                                                    if (file.isPasswordProtected) {
                                                        if (window.onShowPasswordVerificationModal) {
                                                            window.onShowPasswordVerificationModal(file);
                                                        }
                                                    } else {
                                                        handleFileClick(file);
                                                    }
                                                }}
                                                onMenuClick={() => {
                                                    if (file.isPasswordProtected) {
                                                        if (window.onShowPasswordVerificationModal) {
                                                            window.onShowPasswordVerificationModal(file);
                                                        }
                                                    } else {
                                                        handleFileClick(file);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFiles.length === allFiles.length && allFiles.length > 0}
                                                            onChange={() => {
                                                                if (selectedFiles.length === allFiles.length && allFiles.length > 0) {
                                                                    handleSelectFile('deselect-all');
                                                                } else {
                                                                    handleSelectAll();
                                                                }
                                                            }}
                                                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                                        />
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Size
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Protection
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Modified
                                                    </th>
                                                    <th className="relative px-6 py-3">
                                                        <span className="sr-only">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {/* Folders section in list view */}
                                                {currentFolders.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-100">
                                                            <td colSpan="5" className="px-6 py-2">
                                                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                                    Folders ({currentFolders.length})
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {currentFolders.map(folder => (
                                                            <tr 
                                                                key={`folder-${folder.id}`} 
                                                                className="hover:bg-blue-50 cursor-pointer transition-colors duration-200 hover:shadow-sm"
                                                                onClick={() => handleFolderClick(folder)}
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedFolders?.includes(folder.id)}
                                                                        onChange={() => handleSelectFolder?.(folder.id)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <FolderIcon className="w-6 h-6 mr-3" style={{color: COLORS.primary}} />
                                                                        <div className="ml-3">
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                {folder.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    —
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {folder.isPasswordProtected ? (
                                                                        <svg className="w-4 h-4" style={{color: '#e53935'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                        </svg>
                                                                    ) : (
                                                                        <span className="text-gray-400">—</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {new Date(folder.createdAt || folder.createdDate || Date.now()).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    {/* No actions for folders */}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                                {/* Files section in list view */}
                                                {currentFiles.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-100">
                                                            <td colSpan="5" className="px-6 py-2">
                                                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                                    Files ({currentFiles.length})
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                                {/* Individual files */}
                                                {currentFiles.map(file => (
                                                    <tr 
                                                        key={file.id} 
                                                        className={`hover:bg-blue-50 cursor-pointer transition-colors duration-200 hover:shadow-sm ${
                                                            selectedFiles.includes(file.id) ? 'bg-blue-100 shadow-sm' : ''
                                                        }`}
                                                        onClick={() => {
                                                            if (file.isPasswordProtected) {
                                                                if (window.onShowPasswordVerificationModal) {
                                                                    window.onShowPasswordVerificationModal(file);
                                                                }
                                                            } else {
                                                                handleFileClick(file);
                                                            }
                                                        }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFiles.includes(file.id)}
                                                                onChange={() => handleSelectFile(file.id)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <FileIconByType 
                                                                    type={file.fileType} 
                                                                    fileName={file.name || file.fileName} 
                                                                />
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {file.name || file.fileName}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatFileSize(file.size || file.fileSize)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {file.isPasswordProtected ? (
                                                                <svg className="w-4 h-4" style={{color: '#e53935'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-gray-400">—</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(file.uploadedAt || file.uploadDate || Date.now()).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                if (file.isPasswordProtected) {
                                                                    if (window.onShowPasswordVerificationModal) {
                                                                        window.onShowPasswordVerificationModal(file);
                                                                    }
                                                                } else {
                                                                    handleFileClick(file);
                                                                }
                                                            }}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <DotsIcon className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-600">Show:</span>
                                            <select 
                                                value={itemsPerPage} 
                                                onChange={(e) => {
                                                    setItemsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                                className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                            >
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                                <option value={25}>25</option>
                                            </select>
                                        </div>

                                    </div>
                                    {paginatedFiles.totalPages > 1 && (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm font-medium text-gray-700 px-3">
                                                Page {currentPage} of {paginatedFiles.totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={currentPage === paginatedFiles.totalPages}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Dropbox-style History View
export const DropboxHistoryView = ({ files }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const paginatedFiles = paginateData(files, currentPage, itemsPerPage);
    const currentFiles = paginatedFiles.data;
    
    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">Upload History ({files.length} files)</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <HistoryIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No upload history</h3>
                        <p className="text-gray-500">Files you upload will appear here.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            File Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Upload Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentFiles.map(file => (
                                        <tr key={file.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FileIconByType type={file.fileType} fileName={file.name || file.fileName} />
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {file.name || file.fileName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {file.fileType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatFileSize(file.size || file.fileSize)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(file.uploadedAt || file.uploadDate || Date.now()).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Show:</span>
                                    <select 
                                        value={itemsPerPage} 
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                        <option value={25}>25</option>
                                    </select>
                                </div>

                            </div>
                            {paginatedFiles.totalPages > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentPage} of {paginatedFiles.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === paginatedFiles.totalPages}
                                        className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Professional Activity Log View
export const DropboxActivityLogView = ({ activityLogs }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [filterAction, setFilterAction] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filter and search logs
    const filteredLogs = activityLogs.filter(log => {
        const matchesFilter = filterAction === 'all' || log.action === filterAction;
        const matchesSearch = searchTerm === '' || 
            formatActivityDetails(log).toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    
    const paginatedLogs = paginateData(filteredLogs, currentPage, itemsPerPage);
    const currentLogs = paginatedLogs.data;
    
    const formatActivityDetails = (log) => {
        let details = {};
        try {
            details = typeof log.details === 'string' ? JSON.parse(log.details) : (log.details || {});
        } catch (e) {
            details = log.details || {};
        }
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
            case 'SET_PASSWORD':
                description = `Protected file: ${details.fileName || 'Unknown file'}`;
                break;
            case 'REMOVE_PASSWORD':
                description = `Removed protection from: ${details.fileName || 'Unknown file'}`;
                break;
            case 'PASSWORD_VERIFIED':
                description = `Accessed protected file: ${details.fileName || 'Unknown file'}`;
                break;
            case 'SHARE_FILE':
                description = `Shared file: ${details.fileName || 'Unknown file'} with ${details.sharedWith || 'someone'}`;
                break;
            default:
                description = `${log.action}: ${details.fileName || details.folderName || 'Unknown item'}`;
        }
        
        return description;
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'UPLOAD': return '📤';
            case 'DOWNLOAD': return '📥';
            case 'DELETE': return '🗑️';
            case 'RENAME': return '✏️';
            case 'VIEW': return '👁️';
            case 'CREATE_FOLDER': return '📁';
            case 'OPEN_FOLDER': return '📂';
            case 'SET_PASSWORD': return '🔒';
            case 'REMOVE_PASSWORD': return '🔓';
            case 'PASSWORD_VERIFIED': return '✅';
            case 'SHARE_FILE': return '🔗';
            default: return '📋';
        }
    };

    const getActionColor = (action) => {
        switch (action) {
            case 'DELETE': return 'bg-red-50 text-red-700 border-red-200';
            case 'UPLOAD': case 'CREATE_FOLDER': return 'bg-green-50 text-green-700 border-green-200';
            case 'DOWNLOAD': case 'VIEW': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'RENAME': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'OPEN_FOLDER': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'SET_PASSWORD': case 'REMOVE_PASSWORD': case 'PASSWORD_VERIFIED': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'SHARE_FILE': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const getUniqueActions = () => {
        const actions = [...new Set(activityLogs.map(log => log.action))];
        return actions.sort();
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header with Filters */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Activity Logs</h2>
                            <p className="text-sm text-gray-500">{filteredLogs.length} of {activityLogs.length} activities</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search activities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
                                />
                            </div>
                            
                            {/* Filter */}
                            <select
                                value={filterAction}
                                onChange={(e) => {
                                    setFilterAction(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                            >
                                <option value="all">All Actions</option>
                                {getUniqueActions().map(action => (
                                    <option key={action} value={action}>{action}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                {filteredLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ZapIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || filterAction !== 'all' ? 'No matching activities' : 'No activity yet'}
                        </h3>
                        <p className="text-gray-500 max-w-sm">
                            {searchTerm || filterAction !== 'all' 
                                ? 'Try adjusting your search or filter criteria.' 
                                : 'Start interacting with your files to see activity here.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentLogs.map((log, index) => (
                                        <tr key={log.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-3">{getActionIcon(log.action)}</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                                                        {log.action.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {formatActivityDetails(log)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {log.user?.email || log.user?.name || 'System'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 font-medium">
                                                    {formatTimestamp(log.timestamp)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-8 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">Show:</span>
                                    <select 
                                        value={itemsPerPage} 
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    >
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                        <option value={25}>25</option>
                                    </select>
                                </div>
                                <span className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length}
                                </span>
                            </div>
                            {paginatedLogs.totalPages > 1 && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm font-medium text-gray-700 px-3">
                                        Page {currentPage} of {paginatedLogs.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === paginatedLogs.totalPages}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};