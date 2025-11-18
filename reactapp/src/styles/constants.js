// Centralized constants and styles for the application
export const COLORS = {
    primary: '#0061FF',
    primaryDark: '#0052E0',
    primaryLight: '#1A73FF',
    secondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827'
};

// Simple, human-readable CSS classes
export const STYLES = {
    // Layout
    container: 'max-w-7xl mx-auto px-6',
    page: 'min-h-screen bg-gray-50',
    card: 'bg-white rounded-lg shadow-md p-6',
    modal: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    
    // Buttons
    btnPrimary: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
    btnSecondary: 'px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors',
    btnDanger: 'px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors',
    
    // Forms
    input: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    label: 'block text-sm font-medium text-gray-700 mb-2',
    
    // Text
    heading: 'text-2xl font-bold text-gray-900',
    subheading: 'text-lg font-semibold text-gray-800',
    bodyText: 'text-gray-600',
    
    // Navigation
    navLink: 'px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors',
    activeNavLink: 'px-4 py-2 text-blue-600 font-medium',
    
    // File management
    fileCard: 'p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow',
    folderCard: 'p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors',
    
    // Status indicators
    statusActive: 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium',
    statusInactive: 'px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium',
    
    // Utilities
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    hidden: 'hidden',
    loading: 'animate-spin rounded-full border-2 border-blue-600 border-t-transparent'
};

// Common sizes
export const SIZES = {
    icon: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8'
    },
    avatar: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12'
    }
};

// Animation variants for consistent motion
export const ANIMATIONS = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    },
    scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    }
};