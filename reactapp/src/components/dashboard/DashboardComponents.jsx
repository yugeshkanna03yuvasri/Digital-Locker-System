import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, formatFileSize } from './DashboardUtils';
import { Modal } from '../ui';
import { 
    XIcon, 
    TrashIcon, 
    DownloadIcon, 
    FileTextIcon, 
    HistoryIcon, 
    ZapIcon, 
    FolderIcon,
    EyeIcon,
    EditIcon
} from '../ui/Icons';

// Modal component is now imported from ui folder

// New Folder Modal
export const NewFolderModal = ({ isOpen, onClose, onCreateFolder }) => {
    const [folderName, setFolderName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (folderName.trim()) {
            onCreateFolder(folderName.trim());
            setFolderName('');
            onClose();
        }
    };

    return (
        <Modal title="Create New Folder" isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Folder Name
                    </label>
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                        style={{'--tw-ring-color': COLORS.primary}}
                        onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                        onBlur={(e) => e.target.style.borderColor = ''}
                        placeholder="Enter folder name"
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg font-semibold text-white transition shadow-md"
                        style={{backgroundColor: COLORS.primary}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = COLORS.primaryDark}
                        onMouseLeave={(e) => e.target.style.backgroundColor = COLORS.primary}
                        disabled={!folderName.trim()}
                    >
                        Create Folder
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Icons are now imported from ui folder

// File Detail Modal with Enhanced Features
export const FileDetailModal = ({ file, isOpen, onClose, onDeleteFile, onDownloadFile, onRenameFile, onViewFile }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    const [activeTab, setActiveTab] = useState('details');
    const [activityHistory, setActivityHistory] = useState([]);

    // Initialize rename field when modal opens
    React.useEffect(() => {
        if (file && isOpen) {
            setNewFileName(file.name || file.fileName || '');
            // Load activity history for this file
            loadFileActivity();
        }
    }, [file, isOpen]);

    if (!file) return null;

    const loadFileActivity = () => {
        if (!file) return;
        // Get real activity logs from localStorage or props
        const allLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        const fileSpecificLogs = allLogs.filter(log => 
            log.details?.fileName === (file.name || file.fileName) ||
            log.details?.fileId === file.id
        );
        setActivityHistory(fileSpecificLogs);
    };

    const handleDownload = () => {
        onDownloadFile(file);
    };

    const handleView = () => {
        if (onViewFile) {
            onViewFile(file);
        } else {
            // Default view behavior - open in new tab
            if (file.fileUrl) {
                window.open(file.fileUrl, '_blank');
            } else {
                alert('File preview not available');
            }
        }
    };

    const handleRename = async () => {
        if (!newFileName.trim() || newFileName === (file.name || file.fileName)) {
            setIsRenaming(false);
            return;
        }
        
        try {
            if (onRenameFile) {
                await onRenameFile(file.id, newFileName.trim());
                // Update local file object immediately
                file.name = newFileName.trim();
                file.fileName = newFileName.trim();
            }
            setIsRenaming(false);
        } catch (error) {
            console.error('Failed to rename file:', error);
            alert('Failed to rename file');
        }
    };

    const confirmDelete = async () => {
        if (!isDeleting) {
            setIsDeleting(true);
            try {
                await onDeleteFile(file);
                onClose();
            } catch (error) {
                console.error("Failed to delete file:", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const getFileExtension = (fileName) => {
        return fileName ? fileName.split('.').pop()?.toLowerCase() || 'unknown' : 'unknown';
    };

    const getCorrectFileSize = () => {
        const size = file.size || file.fileSize || 0;
        return formatFileSize(size);
    };

    const getCorrectFileName = () => {
        return file.name || file.fileName || 'Unknown File';
    };

    const getCorrectFileType = () => {
        const fileName = getCorrectFileName();
        const extension = getFileExtension(fileName);
        
        // Map extensions to readable types
        const typeMap = {
            'pdf': 'PDF Document',
            'doc': 'Word Document', 'docx': 'Word Document',
            'xls': 'Excel Spreadsheet', 'xlsx': 'Excel Spreadsheet',
            'ppt': 'PowerPoint Presentation', 'pptx': 'PowerPoint Presentation',
            'jpg': 'JPEG Image', 'jpeg': 'JPEG Image', 'png': 'PNG Image', 'gif': 'GIF Image',
            'txt': 'Text File',
            'zip': 'ZIP Archive', 'rar': 'RAR Archive',
            'mp4': 'MP4 Video', 'avi': 'AVI Video',
            'mp3': 'MP3 Audio', 'wav': 'WAV Audio'
        };
        
        return typeMap[extension] || file.fileType || `${extension.toUpperCase()} File`;
    };

    return (
        <Modal title={`File Details`} isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4">
                {/* Tab Navigation */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    >
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`px-4 py-2 font-medium ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    >
                        Activity Logs
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'details' && (
                    <div className="space-y-4">
                        {/* File Name with Rename */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm">File Name</p>
                            <div className="flex items-center gap-2">
                                {isRenaming ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newFileName}
                                            onChange={(e) => setNewFileName(e.target.value)}
                                            className="text-sm border rounded px-2 py-1"
                                            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                                            autoFocus
                                        />
                                        <button onClick={handleRename} className="text-green-600 hover:text-green-800">
                                            ✓
                                        </button>
                                        <button onClick={() => setIsRenaming(false)} className="text-red-600 hover:text-red-800">
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm">{getCorrectFileName()}</p>
                                        <button
                                            onClick={() => setIsRenaming(true)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Rename file"
                                        >
                                            <EditIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm">File Type</p>
                            <p className="text-sm">{getCorrectFileType()}</p>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm">File Size</p>
                            <p className="text-sm">{getCorrectFileSize()}</p>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm">Upload Date</p>
                            <p className="text-sm">{new Date(file.uploadedAt || file.uploadDate || Date.now()).toLocaleString()}</p>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm">File Extension</p>
                            <p className="text-sm uppercase">.{getFileExtension(getCorrectFileName())}</p>
                        </div>
                        
                        {file.parentFolder && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-sm">Location</p>
                                <p className="text-sm">{file.parentFolder.name || 'Root Folder'}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">File History</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium">File Uploaded</p>
                                <p className="text-xs text-gray-600">{new Date(file.uploadedAt || file.uploadDate || Date.now()).toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium">Last Accessed</p>
                                <p className="text-xs text-gray-600">{new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Activity Logs</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {activityHistory.map(activity => (
                                <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            <p className="text-xs text-gray-600">by {activity.user}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons - Single Row with Icons */}
                <div className="pt-4 border-t mt-6">
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={handleView}
                            className="flex items-center justify-center p-3 rounded-lg text-white transition shadow-md bg-blue-500 hover:bg-blue-600"
                            title="View File"
                        >
                            <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => {
                                if (window.onShowPasswordModal) {
                                    window.onShowPasswordModal(file);
                                }
                            }}
                            className="flex items-center justify-center p-3 rounded-lg text-white transition shadow-md bg-yellow-500 hover:bg-yellow-600"
                            title={file.isPasswordProtected ? 'Update Password' : 'Protect File'}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                if (window.onShowShareModal) {
                                    window.onShowShareModal(file);
                                }
                            }}
                            className="flex items-center justify-center p-3 rounded-lg text-white transition shadow-md bg-green-500 hover:bg-green-600"
                            title="Share File"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center justify-center p-3 rounded-lg text-white transition shadow-md"
                            style={{backgroundColor: COLORS.primary}}
                            title="Download File"
                        >
                            <DownloadIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="flex items-center justify-center p-3 rounded-lg text-white transition bg-red-500 hover:bg-red-600 shadow-md disabled:opacity-50"
                            title={isDeleting ? 'Deleting...' : 'Delete File'}
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// Enhanced Sidebar Component with File Type Filters
export const Sidebar = ({ activeView, setActiveView, fileFilter, setFileFilter }) => {
    const { user } = useAuth();

    // SVG Icons for file types
    const PhotoIcon = ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const DocumentIcon = ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const VideoIcon = ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );

    const AudioIcon = ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
    );

    const HomeIcon = ({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    const navItems = [
        { name: 'All Files', icon: FileTextIcon, filter: 'all' },
        { name: 'Folders', icon: FolderIcon, filter: 'folders' },
        { name: 'Photos', icon: PhotoIcon, filter: 'photos' },
        { name: 'Documents', icon: DocumentIcon, filter: 'documents' },
        { name: 'Videos', icon: VideoIcon, filter: 'videos' },
        { name: 'Audio', icon: AudioIcon, filter: 'audio' },
    ];

    const otherItems = [
        { name: 'History', icon: HistoryIcon },
        { name: 'Activity Logs', icon: ZapIcon },
    ];
    
    return (
        <aside className="w-64 flex-shrink-0 text-gray-800 flex flex-col p-4 shadow-xl bg-gradient-to-b" style={{background: `linear-gradient(to bottom, #E3F2FD, #F5F5F5)`, borderRight: `1px solid #E5E7EB`}}>
            <div className="text-2xl font-bold mb-6 flex items-center gap-2" style={{color: COLORS.primary}}>
                <FolderIcon className="h-7 w-7" />
                <span>File Dashboard</span>
            </div>
            <div className="text-xs mb-8 p-2 rounded-lg break-all" style={{backgroundColor: COLORS.primary, color: 'white'}}>
                User: <span className="font-mono text-xs">{user?.email || 'Guest'}</span>
            </div>
            <nav className="flex-grow">
                {/* File Type Filters */}
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 px-2">Browse</h3>
                    <ul>
                        {navItems.map(item => (
                            <li key={item.name}>
                                <button
                                    onClick={() => {
                                        setActiveView('My Files');
                                        setFileFilter(item.filter);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-2.5 my-1 rounded-lg transition-colors duration-200 w-full text-left ${
                                        activeView === 'My Files' && fileFilter === item.filter
                                            ? 'font-semibold shadow-md'
                                            : 'hover:bg-white hover:bg-opacity-20'
                                    }`}
                                    style={{
                                        backgroundColor: activeView === 'My Files' && fileFilter === item.filter ? COLORS.primary : 'transparent',
                                        color: activeView === 'My Files' && fileFilter === item.filter ? 'white' : COLORS.textColor
                                    }}
                                >
                                    <item.icon className="h-5 w-5"/>
                                    <span>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Other Views */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 px-2">Activity</h3>
                    <ul>
                        {otherItems.map(item => (
                            <li key={item.name}>
                                <button
                                    onClick={() => setActiveView(item.name)}
                                    className={`flex items-center gap-3 px-4 py-2.5 my-1 rounded-lg transition-colors duration-200 w-full text-left ${
                                        activeView === item.name
                                            ? 'font-semibold shadow-md'
                                            : 'hover:bg-white hover:bg-opacity-20'
                                    }`}
                                    style={{
                                        backgroundColor: activeView === item.name ? COLORS.primary : 'transparent',
                                        color: activeView === item.name ? 'white' : COLORS.textColor
                                    }}
                                >
                                    <item.icon className="h-5 w-5"/>
                                    <span>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

// Header Component
export const Header = ({ title, backendConnected }) => {
    
    return (
        <header className="bg-white sticky top-0 z-20 shadow-lg border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold" style={{color: COLORS.primary}}>{title}</h1>
                {!backendConnected && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Offline Mode
                    </span>
                )}
            </div>
        </header>
    );
};

// File Icon Component with Better Type Detection and Size Support
export const FileIconByType = ({ type, fileName, size = 'normal' }) => {
    // Size classes
    const sizeClasses = {
        small: "h-4 w-4",
        normal: "h-6 w-6 mr-3",
        large: "h-12 w-12",
        xlarge: "h-16 w-16"
    };
    
    let iconClass = sizeClasses[size] || sizeClasses.normal;
    
    // Get file extension for better type detection
    const getExtension = (name) => {
        if (!name) return '';
        return name.split('.').pop()?.toLowerCase() || '';
    };
    
    const extension = fileName ? getExtension(fileName) : '';
    
    // Enhanced type detection with larger emojis for grid view
    const getIconSize = () => size === 'large' || size === 'xlarge' ? 'text-4xl' : 'text-base';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension) || type?.toLowerCase().includes('image')) {
        return <div className={`${iconClass} text-blue-500 flex items-center justify-center ${getIconSize()}`}>🖼️</div>;
    }
    if (['pdf'].includes(extension) || type?.toLowerCase().includes('pdf')) {
        return <div className={`${iconClass} text-red-500 flex items-center justify-center ${getIconSize()}`}>📄</div>;
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension) || type?.toLowerCase().includes('document') || type?.toLowerCase().includes('word')) {
        return <div className={`${iconClass} text-green-600 flex items-center justify-center ${getIconSize()}`}>📝</div>;
    }
    if (['xls', 'xlsx', 'csv'].includes(extension) || type?.toLowerCase().includes('excel') || type?.toLowerCase().includes('spreadsheet')) {
        return <div className={`${iconClass} text-green-700 flex items-center justify-center ${getIconSize()}`}>📊</div>;
    }
    if (['ppt', 'pptx'].includes(extension) || type?.toLowerCase().includes('powerpoint') || type?.toLowerCase().includes('presentation')) {
        return <div className={`${iconClass} text-orange-600 flex items-center justify-center ${getIconSize()}`}>📽️</div>;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension) || type?.toLowerCase().includes('archive')) {
        return <div className={`${iconClass} text-yellow-600 flex items-center justify-center ${getIconSize()}`}>📦</div>;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension) || type?.toLowerCase().includes('video')) {
        return <div className={`${iconClass} text-purple-600 flex items-center justify-center ${getIconSize()}`}>🎥</div>;
    }
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension) || type?.toLowerCase().includes('audio')) {
        return <div className={`${iconClass} text-pink-600 flex items-center justify-center ${getIconSize()}`}>🎵</div>;
    }
    
    return <FileTextIcon className={`${iconClass} text-gray-500`} />;
};