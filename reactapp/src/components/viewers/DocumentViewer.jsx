import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { documentAPI, activityAPI } from '../../services/api';
import { formatFileSize } from '../dashboard/DashboardUtils';

export default function DocumentViewer() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    loadFile();
  }, [id, loadFile]);

  const loadFile = async () => {
    try {
      setLoading(true);
      const response = await documentAPI.getDocumentById(id);
      setFile(response.data);
      
      // Log view activity
      await activityAPI.recordActivity('VIEW', {
        fileName: response.data.name,
        fileId: response.data.id
      });
      
      // Load file content for preview if possible
      await loadFileContent(response.data);
    } catch (err) {
      console.error('Error loading file:', err);
      setError('File not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (fileData) => {
    try {
      const extension = getFileExtension(fileData.name);
      
      if (isPreviewable(extension)) {
        const response = await documentAPI.downloadDocument(fileData.id);
        const blob = new Blob([response.data]);
        const url = URL.createObjectURL(blob);
        setFileContent({ type: extension, url, blob });
      }
    } catch (err) {
      console.error('Error loading file content:', err);
    }
  };

  const getFileExtension = (fileName) => {
    return fileName ? fileName.split('.').pop()?.toLowerCase() || '' : '';
  };

  const isPreviewable = (extension) => {
    const previewableTypes = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
      'pdf',
      'txt', 'md', 'json', 'xml', 'csv'
    ];
    return previewableTypes.includes(extension);
  };

  const handleDownload = async () => {
    try {
      const response = await documentAPI.downloadDocument(file.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Log download activity
      await activityAPI.recordActivity('DOWNLOAD', {
        fileName: file.name,
        fileId: file.id
      });
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed');
    }
  };

  const renderFileContent = () => {
    if (!fileContent) {
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-6xl mb-4">📄</div>
          <p>Preview not available for this file type</p>
        </div>
      );
    }

    const { type, url } = fileContent;

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(type)) {
      return (
        <div className="text-center">
          <img 
            src={url} 
            alt={file.name}
            className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
            style={{ objectFit: 'contain' }}
          />
        </div>
      );
    }

    if (type === 'pdf') {
      return (
        <div className="w-full h-96">
          <iframe
            src={url}
            className="w-full h-full border rounded-lg"
            title={file.name}
          />
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-6xl mb-4">📄</div>
        <p>Preview available but not implemented for this file type</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading file...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="p-6">
        <Link to="/file-dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to File Dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'File not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/file-dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to File Dashboard
      </Link>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{file.name}</h1>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Size: {formatFileSize(file.size)}</span>
                <span>Type: {file.fileType}</span>
                <span>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
}
