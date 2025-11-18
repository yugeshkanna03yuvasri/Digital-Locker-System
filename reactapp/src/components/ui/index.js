// Export all UI components from a single file for easier imports
export { default as Button } from './Button';
export { default as Modal } from './Modal';
export { default as FileIcon } from './FileIcon';
export * from './Icons';

// Re-export icons for backward compatibility
export { FileTextIcon, ZapIcon } from './Icons';