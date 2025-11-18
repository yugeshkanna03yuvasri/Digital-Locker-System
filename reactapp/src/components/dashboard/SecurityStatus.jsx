import React, { useState, useEffect } from 'react';
import { COLORS } from './DashboardUtils';

const SecurityStatus = ({ user }) => {
    const [securityStats, setSecurityStats] = useState({
        protectedFiles: 0,
        recentAccess: 0,
        failedAttempts: 0,
        lastLogin: null
    });

    useEffect(() => {
        // Fetch security statistics
        fetchSecurityStats();
    }, []);

    const fetchSecurityStats = async () => {
        try {
            // This would call your backend API
            // For now, using mock data
            setSecurityStats({
                protectedFiles: 12,
                recentAccess: 45,
                failedAttempts: 2,
                lastLogin: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to fetch security stats:', error);
        }
    };

    const SecurityCard = ({ icon, title, value, subtitle, color = COLORS.primary }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg" style={{backgroundColor: `${color}20`}}>
                            {icon}
                        </div>
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                    </div>
                    <div className="text-2xl font-bold" style={{color}}>{value}</div>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Security Overview</h2>
                <button 
                    onClick={fetchSecurityStats}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SecurityCard
                    icon={
                        <svg className="w-5 h-5" style={{color: COLORS.primary}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    }
                    title="Protected Files"
                    value={securityStats.protectedFiles}
                    subtitle="Files with password protection"
                />

                <SecurityCard
                    icon={
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    }
                    title="Recent Access"
                    value={securityStats.recentAccess}
                    subtitle="File views in last 24h"
                    color="#10B981"
                />

                <SecurityCard
                    icon={
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    }
                    title="Failed Attempts"
                    value={securityStats.failedAttempts}
                    subtitle="Incorrect password attempts"
                    color="#EF4444"
                />

                <SecurityCard
                    icon={
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    title="Last Login"
                    value={securityStats.lastLogin ? new Date(securityStats.lastLogin).toLocaleDateString() : 'Never'}
                    subtitle="Most recent login time"
                    color="#3B82F6"
                />
            </div>

            {/* Security Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Security Recommendations
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Enable password protection for sensitive files</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Review access logs regularly for suspicious activity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Use strong passwords with at least 8 characters</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityStatus;