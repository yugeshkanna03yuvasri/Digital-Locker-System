import React, { useState, useEffect } from 'react';
import { documentAPI } from '../../services/api';

const FileViewer = ({ file, isOpen, onClose }) => {
    const [fileContent, setFileContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && file) {
            loadFileContent();
        }
    }, [isOpen, file]);

    const loadFileContent = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const fileExtension = getFileExtension(file.name || file.fileName);
            
            // Check if user has access token
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Authentication required');
            }
            
            // Use authenticated API call to get file content
            const response = await documentAPI.downloadDocument(file.id);
            
            // Handle different response types
            let blob;
            if (response.data instanceof Blob) {
                blob = response.data;
            } else {
                blob = new Blob([response.data]);
            }
            
            const url = URL.createObjectURL(blob);
            
            setFileContent({ type: fileExtension, url, blob });
        } catch (err) {
            console.error('Error loading file:', err);
            if (err.response?.status === 401) {
                setError('Authentication failed. Please login again.');
            } else if (err.response?.status === 403) {
                setError('Access denied. You do not have permission to view this file.');
            } else {
                setError('Failed to load file content: ' + (err.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };

    const getFileExtension = (fileName) => {
        return fileName ? fileName.split('.').pop()?.toLowerCase() || '' : '';
    };

    const isPreviewable = (extension) => {
        const previewableTypes = [
            'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', // Images
            'pdf', // PDF
            'txt', 'md', 'json', 'xml', 'csv', // Text files
        ];
        return previewableTypes.includes(extension);
    };

    const renderFileContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p>Loading file...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                    </div>
                </div>
            );
        }

        if (!fileContent) return null;

        const { type, url } = fileContent;

        // Image preview
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(type)) {
            return (
                <div className="text-center">
                    <img 
                        src={url} 
                        alt={file.name || file.fileName}
                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            );
        }

        // PDF preview
        if (type === 'pdf') {
            return (
                <div className="w-full h-96">
                    <iframe
                        src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
                        className="w-full h-full border rounded-lg"
                        title={file.name || file.fileName}
                    />
                </div>
            );
        }

        // Text file preview
        if (['txt', 'md', 'json', 'xml', 'csv'].includes(type)) {
            return (
                <div className="bg-gray-50 p-4 rounded-lg h-96 overflow-auto">
                    <iframe
                        src={url}
                        className="w-full h-full border-0"
                        title={file.name || file.fileName}
                        style={{ backgroundColor: 'white' }}
                    />
                </div>
            );
        }

        // Download only files
        if (type === 'download-only') {
            return (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center text-gray-600">
                        <div className="text-6xl mb-4">📄</div>
                        <p className="text-lg font-medium mb-4">Preview not available</p>
                        <p className="text-sm mb-4">This file type cannot be previewed in browser.</p>
                        <a 
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
                        >
                            Open/Download File
                        </a>
                    </div>
                </div>
            );
        }
        
        // Not previewable
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-lg font-medium mb-2">Preview not available</p>
                    <p className="text-sm">This file type cannot be previewed. Please download to view.</p>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {file.name || file.fileName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {file.fileType} • {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                    {renderFileContent()}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            // Trigger download
                            if (fileContent?.url) {
                                const link = document.createElement('a');
                                link.href = fileContent.url;
                                link.download = file.name || file.fileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileViewer;