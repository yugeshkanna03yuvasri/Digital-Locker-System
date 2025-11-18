import React from 'react';
import { FileTextIcon } from './Icons';

// File Icon Component with Better Type Detection and Size Support
const FileIcon = ({ type, fileName, size = 'normal' }) => {
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

export default FileIcon;