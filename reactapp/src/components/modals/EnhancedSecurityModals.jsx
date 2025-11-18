import React, { useState, useEffect } from 'react';
import { COLORS } from '../dashboard/DashboardUtils';
import { otpAPI } from '../../services/api';

// OTP Verification Modal
export const OTPVerificationModal = ({ isOpen, onClose, file, folder, onVerify }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }
        onVerify(otp)
            .then(() => {
                setOtp('');
                setError('');
                onClose();
            })
            .catch(() => {
                setError('Invalid OTP. Please try again.');
            });
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        try {
            await otpAPI.sendOTP();
            setCountdown(30);
            setError('');
            alert('OTP sent to your registered email address');
        } catch (error) {
            setError('Failed to send OTP');
        } finally {
            setIsResending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold" style={{color: COLORS.primary}}>OTP Verification</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Enter the 6-digit OTP sent to your registered email address
                    </p>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">OTP Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                    setError('');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                autoFocus
                            />
                            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                        </div>
                        
                        <div className="text-center">
                            {countdown > 0 ? (
                                <p className="text-sm text-gray-500">Resend OTP in {countdown}s</p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isResending}
                                    className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                >
                                    {isResending ? 'Sending...' : 'Resend OTP'}
                                </button>
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
                                disabled={otp.length !== 6}
                                className="px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50"
                                style={{backgroundColor: COLORS.primary}}
                            >
                                Verify
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Enhanced Password Protection Modal with Requirements
export const EnhancedPasswordProtectionModal = ({ isOpen, onClose, file, onSetPassword, onRemovePassword }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRemoving, setIsRemoving] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
    });

    const validatePassword = (pwd) => {
        const requirements = {
            minLength: pwd.length >= 8,
            hasUppercase: /[A-Z]/.test(pwd),
            hasLowercase: /[a-z]/.test(pwd),
            hasNumber: /\d/.test(pwd),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
        };
        setPasswordRequirements(requirements);
        return Object.values(requirements).every(req => req);
    };

    const isPasswordValid = () => {
        return Object.values(passwordRequirements).every(req => req) && password === confirmPassword;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isPasswordValid()) {
            alert('Please meet all password requirements');
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
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                
                                <div className="mt-2 space-y-1">
                                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordRequirements.minLength ? '✓' : '✗'} At least 8 characters
                                    </div>
                                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordRequirements.hasUppercase ? '✓' : '✗'} One uppercase letter
                                    </div>
                                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordRequirements.hasLowercase ? '✓' : '✗'} One lowercase letter
                                    </div>
                                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordRequirements.hasNumber ? '✓' : '✗'} One number
                                    </div>
                                    <div className={`text-xs flex items-center gap-2 ${passwordRequirements.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordRequirements.hasSpecial ? '✓' : '✗'} One special character
                                    </div>
                                </div>
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
                                />
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                                )}
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
                                        disabled={!isPasswordValid()}
                                        className="px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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