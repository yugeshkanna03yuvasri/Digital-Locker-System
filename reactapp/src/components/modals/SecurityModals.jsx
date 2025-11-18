import React, { useState } from 'react';
import { COLORS } from '../dashboard/DashboardUtils';
import { LockIcon } from '../ui';

// Password Protection Modal
export const PasswordProtectionModal = ({ isOpen, onClose, file, onSetPassword, onRemovePassword }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRemoving, setIsRemoving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        onSetPassword(file.id, password);
        setPassword('');
        setConfirmPassword('');
        onClose();
    };

    const handleRemove = () => {
        onRemovePassword(file.id);
        onClose();
    };

    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold" style={{color: COLORS.primary}}>
                        Password Protection
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {file.isPasswordProtected ? 'Update or remove password for' : 'Set password for'} "{file.name || file.fileName}"
                    </p>
                </div>
                
                <div className="p-6">
                    {!isRemoving ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    minLength={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    minLength={4}
                                />
                            </div>
                            <div className="flex justify-between pt-4">
                                {file.isPasswordProtected && (
                                    <button
                                        type="button"
                                        onClick={() => setIsRemoving(true)}
                                        className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Remove Password
                                    </button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded-lg font-medium"
                                        style={{backgroundColor: COLORS.primary}}
                                    >
                                        Set Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to remove password protection from this file?
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setIsRemoving(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                                >
                                    Remove Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Password Verification Modal
export const PasswordVerificationModal = ({ isOpen, onClose, file, onVerify }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(file.id, password)
            .then(() => {
                setPassword('');
                setError('');
                onClose();
            })
            .catch(() => {
                setError('Incorrect password');
            });
    };

    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h3 className="text-lg font-semibold" style={{color: COLORS.primary}}>
                            Password Required
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Enter password to access "{file.name || file.fileName}"
                    </p>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                autoFocus
                            />
                            {error && (
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white rounded-lg font-medium"
                                style={{backgroundColor: COLORS.primary}}
                            >
                                Unlock
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Share & Permissions Modal
export const SharePermissionsModal = ({ isOpen, onClose, file, onShare }) => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('view');

    const handleSubmit = (e) => {
        e.preventDefault();
        onShare(file.id, email, permission);
        setEmail('');
        setPermission('view');
        onClose();
    };

    if (!isOpen || !file) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold" style={{color: COLORS.primary}}>
                        Share File
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Share "{file.name || file.fileName}" with others
                    </p>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                placeholder="user@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Permission Level
                            </label>
                            <select
                                value={permission}
                                onChange={(e) => setPermission(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="view">View Only</option>
                                <option value="edit">Edit</option>
                                <option value="full">Full Access</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white rounded-lg font-medium"
                                style={{backgroundColor: COLORS.primary}}
                            >
                                Share
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Folder Password Protection Modal
export const FolderPasswordProtectionModal = ({ isOpen, onClose, folder, onSetPassword, onRemovePassword }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRemoving, setIsRemoving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        onSetPassword(folder.id, password);
        setPassword('');
        setConfirmPassword('');
        onClose();
    };

    const handleRemove = () => {
        onRemovePassword(folder.id);
        onClose();
    };

    if (!isOpen || !folder) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold" style={{color: COLORS.primary}}>
                        Folder Password Protection
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {folder.isPasswordProtected ? 'Update or remove password for' : 'Set password for'} folder "{folder.name}"
                    </p>
                </div>
                
                <div className="p-6">
                    {!isRemoving ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    minLength={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    minLength={4}
                                />
                            </div>
                            <div className="flex justify-between pt-4">
                                {folder.isPasswordProtected && (
                                    <button
                                        type="button"
                                        onClick={() => setIsRemoving(true)}
                                        className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Remove Password
                                    </button>
                                )}
                                <div className="flex gap-3 ml-auto">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white rounded-lg font-medium"
                                        style={{backgroundColor: COLORS.primary}}
                                    >
                                        Set Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to remove password protection from this folder?
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setIsRemoving(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                                >
                                    Remove Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Folder Password Verification Modal
export const FolderPasswordVerificationModal = ({ isOpen, onClose, folder, onVerify }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(folder.id, password)
            .then(() => {
                setPassword('');
                setError('');
                onClose();
            })
            .catch(() => {
                setError('Incorrect password');
            });
    };

    if (!isOpen || !folder) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h3 className="text-lg font-semibold" style={{color: COLORS.primary}}>
                            Folder Password Required
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Enter password to access folder "{folder.name}"
                    </p>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                autoFocus
                            />
                            {error && (
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white rounded-lg font-medium"
                                style={{backgroundColor: COLORS.primary}}
                            >
                                Unlock
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};