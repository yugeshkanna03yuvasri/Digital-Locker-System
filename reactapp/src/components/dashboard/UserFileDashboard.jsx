import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { documentAPI, folderAPI, activityAPI, otpAPI } from '../../services/api';
import { COLORS, formatFileSize, getFileType } from './DashboardUtils';
import { 
    Sidebar, 
    Header, 
    FileDetailModal, 
    NewFolderModal 
} from './DashboardComponents';
import { MyFilesView, HistoryView, ActivityLogView } from './FileViews';
import { DropboxMyFilesView, DropboxHistoryView, DropboxActivityLogView } from './DropboxStyleFileViews';
import { PasswordProtectionModal, PasswordVerificationModal, SharePermissionsModal, FolderPasswordProtectionModal, FolderPasswordVerificationModal } from '../modals/SecurityModals';
import { OTPVerificationModal, EnhancedPasswordProtectionModal } from '../modals/EnhancedSecurityModals';
import FileViewer from '../viewers/FileViewer';

export default function UserFileDashboard() {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState('My Files');
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFile, setModalFile] = useState(null);
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [backendConnected, setBackendConnected] = useState(true);
    const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
    const [viewerFile, setViewerFile] = useState(null);
    
    // Professional features state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('uploadDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterType, setFilterType] = useState('all');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [fileFilter, setFileFilter] = useState('all');
    const [selectedFolders, setSelectedFolders] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPasswordVerifyModal, setShowPasswordVerifyModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [showFolderPasswordModal, setShowFolderPasswordModal] = useState(false);
    const [showFolderPasswordVerifyModal, setShowFolderPasswordVerifyModal] = useState(false);
    const [pendingFolder, setPendingFolder] = useState(null);
    const [modalFolder, setModalFolder] = useState(null);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [pendingOTPFile, setPendingOTPFile] = useState(null);
    const [showEnhancedPasswordModal, setShowEnhancedPasswordModal] = useState(false);
    
    const fileInputRef = useRef(null);

    // Load data from backend
    useEffect(() => {
        if (user) {
            console.log('Loading data for user:', user);
            // Test backend connectivity first
            testBackendConnection();
            loadFolders();
            loadFiles();
            loadActivityLogs();
            
            // Set up global handlers for password modals
            window.onShowFolderPasswordModal = (folder) => {
                setModalFolder(folder);
                setShowFolderPasswordModal(true);
            };
            
            window.onShowPasswordVerificationModal = (file) => {
                setPendingFile(file);
                setShowPasswordVerifyModal(true);
            };
        }
    }, [user]);

    const testBackendConnection = async () => {
        try {
            console.log('Testing backend connection...');
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.log('No access token found');
                setBackendConnected(false);
                return;
            }
            
            const response = await fetch('http://localhost:8080/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Backend connection test:', response.status, response.statusText);
            if (response.ok) {
                const data = await response.json();
                console.log('Backend user data:', data);
                setBackendConnected(true);
            } else if (response.status === 401) {
                console.log('Token expired or invalid');
                setBackendConnected(false);
            } else {
                console.log('Backend connection failed with status:', response.status);
                setBackendConnected(false);
            }
        } catch (error) {
            console.error('Backend connection failed:', error);
            setBackendConnected(false);
            console.warn('Running in offline mode with sample data');
        }
    };

    const loadFolders = async () => {
        try {
            console.log('Loading folders...');
            const response = await folderAPI.getAllFolders();
            console.log('Folders loaded:', response.data);
            let loadedFolders = response.data || [];
            
            // Apply password protection from localStorage for offline mode
            if (!backendConnected) {
                const protectedFolders = JSON.parse(localStorage.getItem('protectedFolders') || '{}');
                loadedFolders = loadedFolders.map(folder => {
                    const protection = protectedFolders[folder.id];
                    return protection ? { ...folder, ...protection } : folder;
                });
            }
            
            setFolders(loadedFolders);
        } catch (error) {
            console.error('Failed to load folders:', error);
            // Add some sample data for testing if backend is not working
            setFolders([
                { id: 1, name: 'Documents', createdAt: new Date().toISOString(), parentId: null },
                { id: 2, name: 'Images', createdAt: new Date().toISOString(), parentId: null },
            ]);
        }
    };

    const loadFiles = async () => {
        try {
            console.log('Loading files...');
            const response = await documentAPI.getAllDocuments();
            console.log('Files loaded:', response.data);
            let loadedFiles = response.data || [];
            
            // Apply password protection from localStorage for offline mode
            if (!backendConnected) {
                const protectedFiles = JSON.parse(localStorage.getItem('protectedFiles') || '{}');
                loadedFiles = loadedFiles.map(file => {
                    const protection = protectedFiles[file.id];
                    return protection ? { ...file, ...protection } : file;
                });
            }
            
            setFiles(loadedFiles);
        } catch (error) {
            console.error('Failed to load files:', error);
            setFiles([]); // Set empty array on error
        }
    };

    const loadActivityLogs = async () => {
        try {
            console.log('Loading activity logs...');
            
            if (backendConnected) {
                const response = await activityAPI.getUserLogs();
                console.log('Activity logs loaded:', response.data);
                setActivityLogs(response.data || []);
            } else {
                // Load from localStorage as fallback
                const localLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
                setActivityLogs(localLogs);
            }
        } catch (error) {
            console.error('Failed to load activity logs:', error);
            // Fallback to localStorage
            const localLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
            setActivityLogs(localLogs);
        }
    };

    // Activity Logger
    const logActivity = async (action, details) => {
        try {
            console.log('Logging activity:', action, details);
            
            if (backendConnected) {
                await activityAPI.recordActivity(action, details);
                // Reload activity logs to get updated list
                loadActivityLogs();
            } else {
                // Fallback to localStorage
                const newLog = {
                    id: Date.now(),
                    action,
                    details,
                    timestamp: new Date().toISOString(),
                    user: user?.email || 'Unknown'
                };
                
                const existingLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
                existingLogs.unshift(newLog);
                localStorage.setItem('activityLogs', JSON.stringify(existingLogs));
                setActivityLogs(prev => [newLog, ...prev]);
            }
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    };

    // File Upload Handler
    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload({ target: { files: e.dataTransfer.files } });
        }
    };

    // Bulk actions
    const handleSelectFile = (fileId) => {
        if (fileId === 'deselect-all') {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(prev => 
                prev.includes(fileId) 
                    ? prev.filter(id => id !== fileId)
                    : [...prev, fileId]
            );
        }
    };

    const handleSelectAll = () => {
        const currentFolderId = currentFolder?.id || null;
        let currentFiles = files.filter(file => {
            const fileFolderId = file.parentFolder?.id || file.folderId || null;
            return fileFolderId === currentFolderId;
        });
        
        // Apply file filter if active
        if (fileFilter !== 'all') {
            switch (fileFilter) {
                case 'photos':
                    currentFiles = currentFiles.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
                    });
                    break;
                case 'documents':
                    currentFiles = currentFiles.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
                    });
                    break;
                case 'videos':
                    currentFiles = currentFiles.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext);
                    });
                    break;
                case 'audio':
                    currentFiles = currentFiles.filter(file => {
                        const ext = (file.name || file.fileName || '').split('.').pop()?.toLowerCase();
                        return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext);
                    });
                    break;
            }
        }
        
        setSelectedFiles(currentFiles.map(f => f.id));
    };

    const handleBulkDelete = async () => {
        if (selectedFiles.length === 0) return;
        
        if (window.confirm(`Delete ${selectedFiles.length} selected files?`)) {
            for (const fileId of selectedFiles) {
                const file = files.find(f => f.id === fileId);
                if (file) {
                    await handleDeleteFile(file);
                }
            }
            setSelectedFiles([]);
        }
    };

    const handleFileUpload = async (event) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;

        console.log('Starting file upload:', fileList.length, 'files');
        setIsUploading(true);
        
        try {
            // Handle multiple files
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                
                if (backendConnected) {
                    // Create FormData for file upload
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('fileName', file.name);
                    formData.append('fileType', getFileType(file.name));
                    if (currentFolder) {
                        formData.append('folderId', currentFolder.id);
                    }

                    console.log('Uploading file to backend:', file.name);
                    const response = await documentAPI.uploadDocument(formData);
                    console.log('Upload response:', response.data);
                    
                    await logActivity('UPLOAD', { 
                        fileName: file.name, 
                        fileSize: formatFileSize(file.size),
                        folderId: currentFolder?.id,
                        fileId: response.data.id
                    });
                } else {
                    // Offline mode - simulate upload
                    console.log('Offline mode: simulating file upload:', file.name);
                    const newFile = {
                        id: Date.now() + i,
                        name: file.name,
                        fileName: file.name,
                        fileType: getFileType(file.name),
                        size: file.size,
                        fileSize: file.size,
                        uploadedAt: new Date().toISOString(),
                        uploadDate: new Date().toISOString(),
                        parentFolder: currentFolder ? { id: currentFolder.id } : null,
                        folderId: currentFolder?.id || null,
                        tags: [], // For future tagging feature
                        expiryDate: null, // For document expiration
                    };
                    setFiles(prev => [newFile, ...prev]);
                    
                    const newLog = {
                        id: Date.now() + i,
                        action: 'UPLOAD',
                        details: { fileName: file.name, fileSize: formatFileSize(file.size) },
                        timestamp: new Date().toISOString()
                    };
                    setActivityLogs(prev => [newLog, ...prev]);
                }
            }
            
            // Reload files if backend connected
            if (backendConnected) {
                await loadFiles();
            }
            
            alert(`${fileList.length} file(s) uploaded successfully!`);
            
        } catch (error) {
            console.error("Upload failed:", error);
            alert("File upload failed: " + (error.response?.data?.error || error.message));
        } finally {
            setIsUploading(false);
            if (event.target.value) event.target.value = null;
        }
    };

    // Folder Creation Handler
    const handleCreateFolder = async (folderName) => {
        try {
            console.log('Creating folder:', folderName);
            
            if (backendConnected) {
                const folderData = {
                    name: folderName,
                    parentId: currentFolder?.id || null,
                };
                
                console.log('Folder data:', folderData);
                const response = await folderAPI.createFolder(folderData);
                console.log('Folder created:', response.data);
                
                // Reload folders to get updated list
                await loadFolders();
                
                // Log activity
                await logActivity('CREATE_FOLDER', { 
                    folderName,
                    parentId: currentFolder?.id 
                });
            } else {
                // Offline mode - simulate folder creation
                console.log('Offline mode: simulating folder creation');
                const newFolder = {
                    id: Date.now(),
                    name: folderName,
                    createdAt: new Date().toISOString(),
                    createdDate: new Date().toISOString(),
                    parentId: currentFolder?.id || null,
                    parentFolder: currentFolder ? { id: currentFolder.id } : null,
                };
                setFolders(prev => [newFolder, ...prev]);
                
                // Add to activity logs
                const newLog = {
                    id: Date.now(),
                    action: 'CREATE_FOLDER',
                    details: { folderName },
                    timestamp: new Date().toISOString()
                };
                setActivityLogs(prev => [newLog, ...prev]);
            }
            
            alert('Folder created successfully!');
            
        } catch (error) {
            console.error('Failed to create folder:', error);
            console.error('Error response:', error.response);
            alert('Failed to create folder: ' + (error.response?.data?.error || error.message));
        }
    };

    // Folder Navigation Handlers
    const handleFolderClick = (folder) => {
        if (folder.isPasswordProtected) {
            setPendingFolder(folder);
            setShowFolderPasswordVerifyModal(true);
        } else {
            setCurrentFolder(folder);
            setBreadcrumb(prev => [...prev, folder]);
            logActivity('OPEN_FOLDER', { 
                folderName: folder.name,
                folderId: folder.id 
            });
        }
    };

    const handleBreadcrumbClick = (index) => {
        if (index === -1) {
            // Go to root
            setCurrentFolder(null);
            setBreadcrumb([]);
        } else {
            // Go to specific folder in breadcrumb
            const targetFolder = breadcrumb[index];
            setCurrentFolder(targetFolder);
            setBreadcrumb(prev => prev.slice(0, index + 1));
        }
    };

    // File Delete Handler
    const handleDeleteFile = async (file) => {
        try {
            await documentAPI.deleteDocument(file.id);
            
            // Reload files to get updated list
            await loadFiles();
            
            // Log activity
            await logActivity('DELETE', { 
                fileName: file.fileName,
                fileId: file.id 
            });
            
        } catch (error) {
            console.error('Failed to delete file:', error);
            alert('Failed to delete file: ' + (error.response?.data?.error || error.message));
            throw error; // Re-throw to handle in modal
        }
    };

    // File Download Handler
    const handleDownloadFile = async (file) => {
        try {
            const response = await documentAPI.downloadDocument(file.id);
            
            // Handle different response types
            let blob;
            if (response.data instanceof Blob) {
                blob = response.data;
            } else {
                blob = new Blob([response.data]);
            }
            
            // Create blob URL and trigger download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.fileName || file.name || 'download';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
            
            // Log activity
            await logActivity('DOWNLOAD', { 
                fileName: file.fileName || file.name,
                fileId: file.id 
            });
            
        } catch (error) {
            console.error('Failed to download file:', error);
            alert('Failed to download file: ' + (error.response?.data?.error || error.message));
        }
    };

    // File Click Handler
    const handleFileClick = (file) => {
        if (file.isPasswordProtected) {
            setPendingFile(file);
            setShowPasswordVerifyModal(true);
        } else {
            setModalFile(file);
            setIsModalOpen(true);
            
            // Set up global handlers for security modals
            window.onShowPasswordModal = (file) => {
                setModalFile(file);
                setShowEnhancedPasswordModal(true);
                setIsModalOpen(false);
            };
            
            window.onShowShareModal = (file) => {
                setModalFile(file);
                setShowShareModal(true);
                setIsModalOpen(false);
            };
        }
    };

    // Password Protection Handlers
    const handleSetPassword = async (fileId, password) => {
        try {
            console.log('Setting password for file:', fileId, 'Backend connected:', backendConnected);
            
            if (backendConnected) {
                console.log('Calling backend API to set password...');
                const response = await documentAPI.setPassword(fileId, password);
                console.log('Backend response:', response);
                
                // Reload files to get updated data from backend
                console.log('Reloading files from backend...');
                await loadFiles();
            } else {
                console.log('Using offline mode for password protection...');
                // Fallback for offline mode
                const protectedFiles = JSON.parse(localStorage.getItem('protectedFiles') || '{}');
                protectedFiles[fileId] = { isPasswordProtected: true, passwordHash: btoa(password) };
                localStorage.setItem('protectedFiles', JSON.stringify(protectedFiles));
                console.log('Saved to localStorage:', protectedFiles);
                
                // Update local state
                setFiles(prev => prev.map(f => 
                    f.id === fileId ? { ...f, isPasswordProtected: true } : f
                ));
            }
            
            await logActivity('SET_PASSWORD', { 
                fileId,
                fileName: files.find(f => f.id === fileId)?.name
            });
            
            alert('Password protection enabled!');
        } catch (error) {
            console.error('Failed to set password:', error);
            console.error('Error details:', error.response?.data || error.message);
            alert('Failed to set password: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleRemovePassword = async (fileId) => {
        try {
            if (backendConnected) {
                await documentAPI.removePassword(fileId);
                // Reload files to get updated data from backend
                await loadFiles();
            } else {
                // Fallback for offline mode
                const protectedFiles = JSON.parse(localStorage.getItem('protectedFiles') || '{}');
                delete protectedFiles[fileId];
                localStorage.setItem('protectedFiles', JSON.stringify(protectedFiles));
                
                setFiles(prev => prev.map(f => 
                    f.id === fileId ? { ...f, isPasswordProtected: false } : f
                ));
            }
            
            await logActivity('REMOVE_PASSWORD', { 
                fileId,
                fileName: files.find(f => f.id === fileId)?.name
            });
            
            alert('Password protection removed!');
        } catch (error) {
            console.error('Failed to remove password:', error);
            alert('Failed to remove password');
        }
    };

    const handleVerifyPassword = async (fileId, password) => {
        try {
            const file = files.find(f => f.id === fileId);
            
            if (backendConnected) {
                await documentAPI.verifyPassword(fileId, password);
            } else {
                // Fallback to localStorage verification
                const protectedFiles = JSON.parse(localStorage.getItem('protectedFiles') || '{}');
                const protection = protectedFiles[fileId];
                if (!protection || protection.passwordHash !== btoa(password)) {
                    throw new Error('Invalid password');
                }
            }
            
            await logActivity('PASSWORD_VERIFIED', { 
                fileId,
                fileName: file.name
            });
            
            // Open file directly after password verification
            setModalFile(file);
            setIsModalOpen(true);
            setShowPasswordVerifyModal(false);
            setPendingFile(null);
            
            // Set up global handlers for security modals
            window.onShowPasswordModal = (file) => {
                setModalFile(file);
                setShowEnhancedPasswordModal(true);
                setIsModalOpen(false);
            };
            
            window.onShowShareModal = (file) => {
                setModalFile(file);
                setShowShareModal(true);
                setIsModalOpen(false);
            };
            
        } catch (error) {
            throw error;
        }
    };

    const handleVerifyOTP = async (otp) => {
        try {
            await otpAPI.verifyOTP(otp);
            
            if (pendingOTPFile) {
                // Handle file OTP verification
                await logActivity('OTP_VERIFIED', { 
                    fileId: pendingOTPFile.id,
                    fileName: pendingOTPFile.name
                });
                
                // Open file after successful OTP verification
                setModalFile(pendingOTPFile);
                setIsModalOpen(true);
                setShowOTPModal(false);
                setPendingOTPFile(null);
                
                // Set up global handlers for security modals
                window.onShowPasswordModal = (file) => {
                    setModalFile(file);
                    setShowEnhancedPasswordModal(true);
                    setIsModalOpen(false);
                };
                
                window.onShowShareModal = (file) => {
                    setModalFile(file);
                    setShowShareModal(true);
                    setIsModalOpen(false);
                };
            } else if (pendingFolder) {
                // Handle folder OTP verification
                await logActivity('FOLDER_OTP_VERIFIED', { 
                    folderId: pendingFolder.id,
                    folderName: pendingFolder.name
                });
                
                // Open folder after successful OTP verification
                setCurrentFolder(pendingFolder);
                setBreadcrumb(prev => [...prev, pendingFolder]);
                setShowOTPModal(false);
                setPendingFolder(null);
                
                await logActivity('OPEN_FOLDER', { 
                    folderName: pendingFolder.name,
                    folderId: pendingFolder.id 
                });
            }
        } catch (error) {
            throw error;
        }
    };

    const handleShareFile = async (fileId, email, permission) => {
        try {
            // In real app, this would call backend API
            const shareData = {
                fileId,
                email,
                permission,
                sharedAt: new Date().toISOString()
            };
            
            // Store share info in localStorage for demo
            const existingShares = JSON.parse(localStorage.getItem('fileShares') || '[]');
            existingShares.push(shareData);
            localStorage.setItem('fileShares', JSON.stringify(existingShares));
            
            await logActivity('SHARE_FILE', { 
                fileId,
                fileName: files.find(f => f.id === fileId)?.name,
                sharedWith: email,
                permission
            });
            
            alert(`File shared with ${email} (${permission} access)`);
        } catch (error) {
            console.error('Failed to share file:', error);
            alert('Failed to share file');
        }
    };

    // File Rename Handler
    const handleRenameFile = async (fileId, newName) => {
        try {
            const oldName = modalFile?.fileName || modalFile?.name;
            
            // Update local state immediately
            setFiles(prev => prev.map(f => 
                f.id === fileId ? { ...f, name: newName, fileName: newName } : f
            ));
            
            // Update modal file immediately
            if (modalFile && modalFile.id === fileId) {
                setModalFile(prev => ({ ...prev, name: newName, fileName: newName }));
            }
            
            // Log activity
            await logActivity('RENAME', { 
                fileId,
                oldName,
                newName,
                fileName: newName
            });
            
            if (backendConnected) {
                // Call backend API to rename file
                await documentAPI.renameDocument(fileId, newName);
                console.log('File renamed on backend');
            }
            
        } catch (error) {
            console.error('Failed to rename file:', error);
            // Revert local changes on error
            setFiles(prev => prev.map(f => 
                f.id === fileId ? { ...f, name: modalFile?.name, fileName: modalFile?.fileName } : f
            ));
            alert('Failed to rename file: ' + (error.response?.data?.error || error.message));
            throw error;
        }
    };

    // Folder Delete Handler
    const handleFolderDelete = async (folder) => {
        if (window.confirm(`Delete folder "${folder.name}"? This will also delete all files inside it.`)) {
            try {
                if (backendConnected) {
                    await folderAPI.deleteFolder(folder.id);
                }
                
                // Remove folder from local state
                setFolders(prev => prev.filter(f => f.id !== folder.id));
                
                // Log activity
                await logActivity('DELETE_FOLDER', { 
                    folderName: folder.name,
                    folderId: folder.id 
                });
                
                alert('Folder deleted successfully!');
            } catch (error) {
                console.error('Failed to delete folder:', error);
                alert('Failed to delete folder: ' + (error.response?.data?.error || error.message));
            }
        }
    };

    // Folder Selection Handler
    const handleSelectFolder = (folderId) => {
        setSelectedFolders(prev => 
            prev.includes(folderId) 
                ? prev.filter(id => id !== folderId)
                : [...prev, folderId]
        );
    };

    // Bulk Folder Delete Handler
    const handleBulkFolderDelete = async () => {
        if (selectedFolders.length === 0) return;
        
        if (window.confirm(`Delete ${selectedFolders.length} selected folders? This will also delete all files inside them.`)) {
            for (const folderId of selectedFolders) {
                const folder = folders.find(f => f.id === folderId);
                if (folder) {
                    await handleFolderDelete(folder);
                }
            }
            setSelectedFolders([]);
        }
    };

    // File View Handler
    const handleViewFile = async (file) => {
        try {
            // Log view activity
            await logActivity('VIEW', { 
                fileName: file.fileName || file.name,
                fileId: file.id 
            });
            
            // Always use the file viewer modal for proper authentication
            setViewerFile(file);
            setIsFileViewerOpen(true);
        } catch (error) {
            console.error('Failed to view file:', error);
            alert('Failed to view file: ' + (error.response?.data?.error || error.message));
        }
    };

    // Folder Password Protection Handlers
    const handleSetFolderPassword = async (folderId, password) => {
        try {
            if (backendConnected) {
                await folderAPI.setPassword(folderId, password);
                // Reload folders to get updated data from backend
                await loadFolders();
            } else {
                // Fallback for offline mode
                const protectedFolders = JSON.parse(localStorage.getItem('protectedFolders') || '{}');
                protectedFolders[folderId] = { isPasswordProtected: true, passwordHash: btoa(password) };
                localStorage.setItem('protectedFolders', JSON.stringify(protectedFolders));
                
                // Update local state
                setFolders(prev => prev.map(f => 
                    f.id === folderId ? { ...f, isPasswordProtected: true } : f
                ));
            }
            
            await logActivity('SET_FOLDER_PASSWORD', { 
                folderId,
                folderName: folders.find(f => f.id === folderId)?.name
            });
            
            alert('Folder password protection enabled!');
        } catch (error) {
            console.error('Failed to set folder password:', error);
            alert('Failed to set folder password');
        }
    };

    const handleRemoveFolderPassword = async (folderId) => {
        try {
            if (backendConnected) {
                await folderAPI.removePassword(folderId);
                // Reload folders to get updated data from backend
                await loadFolders();
            } else {
                // Fallback for offline mode
                const protectedFolders = JSON.parse(localStorage.getItem('protectedFolders') || '{}');
                delete protectedFolders[folderId];
                localStorage.setItem('protectedFolders', JSON.stringify(protectedFolders));
                
                setFolders(prev => prev.map(f => 
                    f.id === folderId ? { ...f, isPasswordProtected: false } : f
                ));
            }
            
            await logActivity('REMOVE_FOLDER_PASSWORD', { 
                folderId,
                folderName: folders.find(f => f.id === folderId)?.name
            });
            
            alert('Folder password protection removed!');
        } catch (error) {
            console.error('Failed to remove folder password:', error);
            alert('Failed to remove folder password');
        }
    };

    const handleVerifyFolderPassword = async (folderId, password) => {
        try {
            const folder = folders.find(f => f.id === folderId);
            
            if (backendConnected) {
                await folderAPI.verifyPassword(folderId, password);
            } else {
                // Fallback to localStorage verification
                const protectedFolders = JSON.parse(localStorage.getItem('protectedFolders') || '{}');
                const protection = protectedFolders[folderId];
                if (!protection || protection.passwordHash !== btoa(password)) {
                    throw new Error('Invalid password');
                }
            }
            
            await logActivity('FOLDER_PASSWORD_VERIFIED', { 
                folderId,
                folderName: folder.name
            });
            
            // Open folder immediately after successful verification
            setCurrentFolder(folder);
            setBreadcrumb(prev => [...prev, folder]);
            setShowFolderPasswordVerifyModal(false);
            setPendingFolder(null);
            
            await logActivity('OPEN_FOLDER', { 
                folderName: folder.name,
                folderId: folder.id 
            });
        } catch (error) {
            throw error;
        }
    };





    const renderContent = () => {
        switch(activeView) {
            case 'My Files':
                return (
                    <DropboxMyFilesView 
                        files={files}
                        folders={folders}
                        currentFolder={currentFolder}
                        breadcrumb={breadcrumb}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        selectedFiles={selectedFiles}
                        handleSelectFile={handleSelectFile}
                        handleSelectAll={handleSelectAll}
                        handleBulkDelete={handleBulkDelete}
                        handleFolderClick={handleFolderClick}
                        handleBreadcrumbClick={handleBreadcrumbClick}
                        handleFileClick={handleFileClick}
                        setIsNewFolderModalOpen={setIsNewFolderModalOpen}
                        fileInputRef={fileInputRef}
                        handleFileUpload={handleFileUpload}
                        isUploading={isUploading}
                        dragActive={dragActive}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        fileFilter={fileFilter}
                        handleFolderDelete={handleFolderDelete}
                        selectedFolders={selectedFolders}
                        handleSelectFolder={handleSelectFolder}
                        handleBulkFolderDelete={handleBulkFolderDelete}
                    />
                );
            case 'History':
                return <DropboxHistoryView files={files} />;
            case 'Activity Logs':
                return <DropboxActivityLogView activityLogs={activityLogs} />;
            default:
                return (
                    <DropboxMyFilesView 
                        files={files}
                        folders={folders}
                        currentFolder={currentFolder}
                        breadcrumb={breadcrumb}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        selectedFiles={selectedFiles}
                        handleSelectFile={handleSelectFile}
                        handleSelectAll={handleSelectAll}
                        handleBulkDelete={handleBulkDelete}
                        handleFolderClick={handleFolderClick}
                        handleBreadcrumbClick={handleBreadcrumbClick}
                        handleFileClick={handleFileClick}
                        setIsNewFolderModalOpen={setIsNewFolderModalOpen}
                        fileInputRef={fileInputRef}
                        handleFileUpload={handleFileUpload}
                        isUploading={isUploading}
                        dragActive={dragActive}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        fileFilter={fileFilter}
                    />
                );
        }
    };

    return (
        <div className="flex w-screen font-sans antialiased" style={{backgroundColor: COLORS.offWhite, margin: 0, padding: 0, position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, height: 'calc(100vh - 64px)'}}>
            <Sidebar activeView={activeView} setActiveView={setActiveView} fileFilter={fileFilter} setFileFilter={setFileFilter} />
            <main className="flex-1 flex flex-col overflow-hidden" style={{margin: 0, padding: 0}}>
                <Header title={activeView} backendConnected={backendConnected} />
                <div className="flex-1 overflow-hidden" style={{margin: 0, padding: 0}}>
                    {renderContent()}
                </div>
            </main>
            
            <FileDetailModal
                file={modalFile}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDeleteFile={handleDeleteFile}
                onDownloadFile={handleDownloadFile}
                onRenameFile={handleRenameFile}
                onViewFile={handleViewFile}
            />
            
            <NewFolderModal
                isOpen={isNewFolderModalOpen}
                onClose={() => setIsNewFolderModalOpen(false)}
                onCreateFolder={handleCreateFolder}
            />
            
            <FileViewer
                file={viewerFile}
                isOpen={isFileViewerOpen}
                onClose={() => {
                    setIsFileViewerOpen(false);
                    setViewerFile(null);
                }}
            />
            
            <PasswordProtectionModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                file={modalFile}
                onSetPassword={handleSetPassword}
                onRemovePassword={handleRemovePassword}
            />
            
            <EnhancedPasswordProtectionModal
                isOpen={showEnhancedPasswordModal}
                onClose={() => setShowEnhancedPasswordModal(false)}
                file={modalFile}
                onSetPassword={handleSetPassword}
                onRemovePassword={handleRemovePassword}
            />
            
            <OTPVerificationModal
                isOpen={showOTPModal}
                onClose={() => {
                    setShowOTPModal(false);
                    setPendingOTPFile(null);
                    setPendingFolder(null);
                }}
                file={pendingOTPFile}
                folder={pendingFolder}
                onVerify={handleVerifyOTP}
            />
            
            <PasswordVerificationModal
                isOpen={showPasswordVerifyModal}
                onClose={() => {
                    setShowPasswordVerifyModal(false);
                    setPendingFile(null);
                }}
                file={pendingFile}
                onVerify={handleVerifyPassword}
            />
            
            <SharePermissionsModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                file={modalFile}
                onShare={handleShareFile}
            />
            
            <FolderPasswordProtectionModal
                isOpen={showFolderPasswordModal}
                onClose={() => setShowFolderPasswordModal(false)}
                folder={modalFolder}
                onSetPassword={handleSetFolderPassword}
                onRemovePassword={handleRemoveFolderPassword}
            />
            
            <FolderPasswordVerificationModal
                isOpen={showFolderPasswordVerifyModal}
                onClose={() => {
                    setShowFolderPasswordVerifyModal(false);
                    setPendingFolder(null);
                }}
                folder={pendingFolder}
                onVerify={handleVerifyFolderPassword}
            />
        </div>
    );
}