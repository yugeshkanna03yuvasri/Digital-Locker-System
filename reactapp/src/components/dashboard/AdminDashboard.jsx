import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

// NOTE: This application requires Chart.js to be globally loaded (window.Chart) 
// for the analytics graphs to function correctly. 

// --- Custom Theme Colors ---
const COLORS = {
    primary: '#0061FF',
    primaryDark: '#0052E0',
    primaryLight: '#1A73FF',
    cardGradientFrom: '#E3F2FD',
    cardGradientTo: '#F5F5F5',
    cardBorder: '#E5E7EB',
    offWhite: '#FFFFFF',
    textColor: '#000000',
    textSecondary: '#444444',
    
    // Original contrasting colors for metrics/charts (for clarity)
    blueMetric: '#0061FF',   // Primary blue
    greenMetric: '#10b981',  // Green
    yellowMetric: '#f59e0b', // Yellow
    redMetric: '#ef4444',    // Red
};

// --- SVG Icon Components (Lucide Icons) ---
const HomeIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const UsersIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const FileIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>);
const AlertCircleIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>);
const SearchIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const MoreVerticalIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>);
const ActivityIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>);
const TrendingUpIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>);
const ShieldIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);
const DatabaseIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>);

// Storage limit per user (1TB in GB)
const STORAGE_LIMIT_GB = 1024;

// --- Mock Data (keeping for fallback) ---

// Stats will be calculated from real data
const getStatsFromData = (allUsers, totalFiles, totalStorage) => {
    const nonAdminUsers = allUsers.filter(user => 
        user.role !== 'Admin' && 
        user.role !== 'ADMIN' && 
        user.role !== 'admin' &&
        user.role !== 'ROLE_ADMIN'
    );
    const activeUsers = nonAdminUsers.filter(user => user.status === 'active' || user.isActive !== false).length;
    const avgStoragePerUser = nonAdminUsers.length > 0 ? (totalStorage / nonAdminUsers.length).toFixed(1) : '0';
    
    return [
        { name: 'Total Users', value: nonAdminUsers.length.toString(), change: '+12%', icon: UsersIcon, color: `bg-blue-500`, subtitle: `${activeUsers} active` },
        { name: 'Total Files', value: totalFiles.toString(), change: '+8%', icon: FileIcon, color: `bg-green-500`, subtitle: 'Documents stored' }, 
        { name: 'Storage Used', value: `${(totalStorage / 1024).toFixed(1)} TB`, change: '+15%', icon: DatabaseIcon, color: `bg-purple-500`, subtitle: `${avgStoragePerUser} GB avg/user` },
        { name: 'Active Sessions', value: '24', change: '+5%', icon: ActivityIcon, color: `bg-orange-500`, subtitle: 'Users online now' },
        { name: 'Growth Rate', value: '18%', change: '+3%', icon: TrendingUpIcon, color: `bg-indigo-500`, subtitle: 'Monthly increase' },
        { name: 'Security Score', value: '98%', change: 'Excellent', icon: ShieldIcon, color: `bg-emerald-500`, subtitle: 'System health' }
    ];
};

const monthlyUsageData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [350, 420, 500, 610, 750, 800, 780, 920, 1050, 1150, 1200, 1350],
};

const fileTypeData = {
    labels: ['Documents', 'Images', 'Videos', 'Archives', 'Others'],
    data: [45, 30, 15, 5, 5], // Percentages
};

const demographicsData = {
    labels: ['Standard', 'Premium', 'Enterprise'],
    data: [60, 30, 10], // Percentages
    colors: [COLORS.primary, COLORS.greenMetric, COLORS.yellowMetric] 
};

// --- Chart/Analytics Components ---

const ChartFallback = () => (
    <div className={`flex items-center justify-center h-full bg-[${COLORS.primaryLight}] border border-[${COLORS.primary}] rounded-lg p-4 text-[${COLORS.primary}]`}>
        <AlertCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
        <p className="text-sm font-medium">
            Chart.js is not loaded globally. Please ensure the library CDN is available in the environment to display graphs.
        </p>
    </div>
);

const ChartContainer = ({ title, children }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md h-full flex flex-col ring-1 ring-gray-100`}>
        <h3 className={`text-lg font-semibold text-[${COLORS.textColor}] mb-4 border-b pb-2`}>{title}</h3>
        <div className="flex-1 min-h-[250px] relative">
            {children}
        </div>
    </div>
);

// Generic chart creation function
const useChart = (config) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current && typeof window.Chart !== 'undefined') {
            const ctx = chartRef.current.getContext('2d');
            
            if (chartRef.current.chartInstance) {
                chartRef.current.chartInstance.destroy();
            }

            // Create new chart instance
            chartRef.current.chartInstance = new window.Chart(ctx, config);

            // Cleanup function
            return () => {
                if (chartRef.current && chartRef.current.chartInstance) {
                    chartRef.current.chartInstance.destroy();
                }
            };
        }
    }, [config.data.datasets, config.data.labels, config.type]);

    if (typeof window.Chart === 'undefined') {
        return <ChartFallback />;
    }

    return <canvas ref={chartRef} className="w-full h-full"></canvas>;
};

const LineChart = () => {
    const config = {
        type: 'line',
        data: {
            labels: monthlyUsageData.labels,
            datasets: [{
                label: 'Monthly Storage Usage (GB)',
                data: monthlyUsageData.data,
                borderColor: COLORS.primary,
                backgroundColor: `rgba(0, 97, 255, 0.1)`,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Usage (GB)' } }
            },
            plugins: { legend: { display: true } }
        }
    };
    return useChart(config);
};

const PieChart = () => {
    // Pie chart colors use distinct metric colors
    const config = {
        type: 'doughnut',
        data: {
            labels: demographicsData.labels,
            datasets: [{
                label: 'User Demographics',
                data: demographicsData.data,
                backgroundColor: demographicsData.colors,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: false }
            }
        }
    };
    return useChart(config);
};

const BarChart = () => {
    const config = {
        type: 'bar',
        data: {
            labels: fileTypeData.labels,
            datasets: [{
                label: 'Storage Breakdown (%)',
                data: fileTypeData.data,
                backgroundColor: [
                    COLORS.greenMetric, COLORS.yellowMetric, COLORS.redMetric, COLORS.primary, '#6b7280'
                ],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { callback: (value) => value + '%' }
                }
            },
            plugins: { legend: { display: false } }
        }
    };
    return useChart(config);
};


// --- Layout Components ---

const Sidebar = ({ activeView, setActiveView }) => {
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Users', icon: UsersIcon },
        { name: 'Queries', icon: AlertCircleIcon },
    ];
    
    return (
        <aside className="w-64 flex-shrink-0 text-gray-800 flex flex-col p-4 shadow-xl bg-gradient-to-b" style={{background: `linear-gradient(to bottom, ${COLORS.cardGradientFrom}, ${COLORS.cardGradientTo})`, borderRight: `1px solid ${COLORS.cardBorder}`}}>
            <div className="text-2xl font-bold mb-6 flex items-center gap-2" style={{color: COLORS.primary}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <span>Admin Panel</span>
            </div>
            <nav className="flex-grow">
                <div>
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 px-2">Management</h3>
                    <ul>
                        {navItems.map(item => (
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

const Header = ({ title }) => {
    return (
        <header className="bg-white sticky top-0 z-10 shadow-sm p-4 flex justify-between items-center">
            <h1 className={`text-2xl font-semibold text-[${COLORS.textColor}]`}>{title}</h1>
        </header>
    );
};

const StatCard = ({ item }) => (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md flex items-start justify-between transition-transform hover:scale-[1.02] cursor-pointer ring-1 ring-gray-100">
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
            <p className={`text-2xl lg:text-3xl font-bold text-[${COLORS.textColor}] mt-1`}>{item.value}</p>
            {item.subtitle && <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>}
            <p className={`text-xs mt-2 font-medium ${item.change.startsWith('+') ? 'text-green-600' : (item.change === 'Excellent' ? 'text-green-600' : 'text-red-600')}`}>
                {item.change} vs last period
            </p>
        </div>
        <div className={`${item.color} p-2 lg:p-3 rounded-full text-white shadow-lg flex-shrink-0 ml-2`}>
            <item.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
        </div>
    </div>
);

const DashboardView = ({ dashboardData }) => {
    const stats = getStatsFromData(dashboardData.users, dashboardData.totalFiles, dashboardData.totalStorage);
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-semibold text-[${COLORS.textColor}]`}>System Overview</h2>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {stats.map(item => (
                    <StatCard key={item.name} item={item} />
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md ring-1 ring-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">New user registered</p>
                                <p className="text-xs text-gray-500">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">File uploaded</p>
                                <p className="text-xs text-gray-500">5 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Storage limit warning</p>
                                <p className="text-xs text-gray-500">1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md ring-1 ring-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">System Health</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Server Load</span>
                                <span>23%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{width: '23%'}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Memory Usage</span>
                                <span>67%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '67%'}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Disk Space</span>
                                <span>45%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md ring-1 ring-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition">
                            <div className="font-medium text-sm">Send System Alert</div>
                            <div className="text-xs text-gray-500">Notify all users</div>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition">
                            <div className="font-medium text-sm">Generate Report</div>
                            <div className="text-xs text-gray-500">Monthly analytics</div>
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition">
                            <div className="font-medium text-sm">Backup System</div>
                            <div className="text-xs text-gray-500">Create full backup</div>
                        </button>
                    </div>
                </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-700 pt-2">Analytics & Usage Statistics</h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 min-h-[400px]">
                    <ChartContainer title="Monthly Storage Usage (GB) - Trend">
                        <LineChart />
                    </ChartContainer>
                </div>
                <div className="xl:col-span-1 min-h-[400px]">
                    <ChartContainer title="User Demographics by Plan - Proportion">
                        <PieChart />
                    </ChartContainer>
                </div>
            </div>

            <div className="pt-2 min-h-[400px]">
                <ChartContainer title="Storage Breakdown by File Type - Comparison">
                    <BarChart />
                </ChartContainer>
            </div>
        </div>
    );
};

const UserTable = ({ users, searchTerm, setSearchTerm, sortBy, setSortBy, sortOrder, setSortOrder, currentPage, itemsPerPage, setCurrentPage, setItemsPerPage }) => {
    // Filter out admin users
    const nonAdminUsers = users.filter(user => 
        user.role !== 'Admin' && 
        user.role !== 'ADMIN' && 
        user.role !== 'admin' &&
        user.role !== 'ROLE_ADMIN'
    );
    
    const sortedUsers = [...nonAdminUsers].sort((a, b) => {
        let aVal, bVal;
        switch (sortBy) {
            case 'name':
                aVal = (a.name || '').toLowerCase();
                bVal = (b.name || '').toLowerCase();
                break;
            case 'email':
                aVal = (a.email || '').toLowerCase();
                bVal = (b.email || '').toLowerCase();
                break;
            case 'storage':
                aVal = a.storageUsed || 0;
                bVal = b.storageUsed || 0;
                break;
            case 'date':
                aVal = new Date(a.createdAt || a.joined || 0).getTime();
                bVal = new Date(b.createdAt || b.joined || 0).getTime();
                break;
            case 'status':
                aVal = (a.status === 'active' || a.isActive !== false) ? 1 : 0;
                bVal = (b.status === 'active' || b.isActive !== false) ? 1 : 0;
                break;
            default:
                return 0;
        }
        
        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    
    const handleSortChange = (value) => {
        const [field, order] = value.split('-');
        setSortBy(field);
        setSortOrder(order);
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md ring-1 ring-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-80">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[${COLORS.primary}] focus:border-[${COLORS.primary}] focus:outline-none transition`}
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select 
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="storage-desc">Highest Storage</option>
                        <option value="storage-asc">Lowest Storage</option>
                        <option value="status-asc">Active First</option>
                        <option value="status-desc">Inactive First</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead className="border-b bg-gray-50">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Name</th>
                            <th className="p-4 font-medium text-gray-600">Storage Used</th>
                            <th className="p-4 font-medium text-gray-600">Status</th>
                            <th className="p-4 font-medium text-gray-600 hidden md:table-cell">Joined Date</th>
                            <th className="p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map(user => (
                                <tr key={user.id} className={`border-b hover:bg-[${COLORS.primaryLight}]/50 transition duration-150`}>
                                    <td className="p-4 flex items-center gap-3">
                                        <img 
                                            src={user.avatar} 
                                            onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/150x150/${COLORS.primary.substring(1)}/fff?text=${user.name.charAt(0)}` }} 
                                            alt={user.name} 
                                            className={`h-10 w-10 rounded-full object-cover ring-1 ring-[${COLORS.primary}]`} 
                                        />
                                        <div>
                                            <p className={`font-semibold text-[${COLORS.textColor}]`}>{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className={`p-4 text-[${COLORS.textColor}]`}>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{user.storageUsed} GB</span>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div 
                                                    className={`bg-[${COLORS.primary}] h-2 rounded-full transition-all duration-300`} 
                                                    style={{width: `${Math.min((user.storageUsed / STORAGE_LIMIT_GB) * 100, 100)}%`}}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">{((user.storageUsed / STORAGE_LIMIT_GB) * 100).toFixed(1)}% of 1TB</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            (user.status === 'active' || user.isActive !== false) 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {(user.status === 'active' || user.isActive !== false) ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className={`p-4 text-[${COLORS.textColor}] hidden md:table-cell`}>{new Date(user.createdAt || user.joined).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button className={`text-gray-500 hover:text-[${COLORS.primary}] p-1 rounded-full hover:bg-gray-100 transition`}>
                                            <MoreVerticalIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500 bg-gray-50 rounded-b-xl">
                                    No users found matching "{searchTerm}".
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1 text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                    </select>
                    <span className="text-sm text-gray-600 ml-4">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedUsers.length)} of {sortedUsers.length} users
                    </span>
                </div>
                
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        
                        {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                            const pageNum = i + Math.max(1, currentPage - 2);
                            if (pageNum > totalPages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 border rounded text-sm ${
                                        currentPage === pageNum 
                                            ? `bg-[${COLORS.primary}] text-white border-[${COLORS.primary}]` 
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const UsersView = ({ users }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Filter logic
    const filteredUsers = users.filter(user =>
        (user.name || user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UserTable 
            users={filteredUsers} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
        />
    );
};

const QueriesView = () => (
    <div className={`bg-white p-10 rounded-xl shadow-md ring-1 ring-gray-100 mt-6 flex flex-col items-center justify-center text-center h-[70vh]`}>
        <h2 className={`text-3xl font-bold text-[${COLORS.textColor}] mb-4`}>User Support Queries & Alerts</h2>
        <AlertCircleIcon className="h-16 w-16 text-red-500 mb-6" />
        <p className="text-gray-600 max-w-lg">
            This section will manage real-time support requests and security alerts from the system, allowing the administration team to address issues quickly.
        </p>
        <button className={`mt-8 bg-[${COLORS.primary}] text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:bg-[${COLORS.primaryDark}] transition transform hover:scale-[1.02]`}>
            View Active Tickets (4 Open)
        </button>
    </div>
);


// --- Main App Component ---

export default function App() {
    const [activeView, setActiveView] = useState('Dashboard');
    const [dashboardData, setDashboardData] = useState({
        users: [],
        totalFiles: 0,
        totalStorage: 0,
        loading: true
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            console.log('Fetching admin dashboard data...');
            const [usersResponse, statsResponse] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/stats')
            ]);
            
            console.log('Users response:', usersResponse.data);
            console.log('Stats response:', statsResponse.data);
            
            const users = usersResponse.data.map(user => ({
                ...user,
                name: user.name || user.username,
                storageUsed: parseFloat((user.storageUsed / (1024 * 1024 * 1024)).toFixed(2)), // Convert bytes to GB
                avatar: user.avatar || `https://placehold.co/150x150/${COLORS.primary.substring(1)}/fff?text=${(user.name || user.username || 'U').charAt(0)}`,
                status: user.status || 'active',
                isActive: user.isActive !== false
            }));
            
            console.log('Processed users:', users);
            
            setDashboardData({
                users,
                totalFiles: statsResponse.data.totalFiles || 0,
                totalStorage: parseFloat((statsResponse.data.totalStorage / (1024 * 1024 * 1024)).toFixed(2)), // Convert bytes to GB
                loading: false
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            console.error('Error details:', error.response?.data || error.message);
            // Fallback to mock data for development
            const mockUsers = [
                { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'User', status: 'active', storageUsed: 15.2, createdAt: '2023-01-15', avatar: `https://placehold.co/150x150/${COLORS.primary.substring(1)}/fff?text=A` },
                { id: 2, name: 'Bob Williams', email: 'bob.w@example.com', role: 'User', status: 'active', storageUsed: 4.8, createdAt: '2023-02-20', avatar: `https://placehold.co/150x150/${COLORS.primary.substring(1)}/fff?text=B` },
                { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'User', status: 'inactive', storageUsed: 9.1, createdAt: '2023-03-10', avatar: `https://placehold.co/150x150/${COLORS.primary.substring(1)}/fff?text=C` }
            ];
            setDashboardData({
                users: mockUsers,
                totalFiles: 150,
                totalStorage: 29.1,
                loading: false
            });
        }
    };

    const renderContent = () => {
        if (dashboardData.loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-[${COLORS.primary}] mx-auto mb-4`}></div>
                        <p className="text-gray-600">Loading dashboard data...</p>
                    </div>
                </div>
            );
        }

        switch(activeView) {
            case 'Dashboard':
                return <DashboardView dashboardData={dashboardData} />;
            case 'Users':
                return <UsersView users={dashboardData.users} />;
            case 'Queries':
                return <QueriesView />;
            default:
                return <DashboardView dashboardData={dashboardData} />;
        }
    };

    return (
        <div className="flex h-screen font-sans antialiased pt-16" style={{backgroundColor: COLORS.offWhite}}>
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title={activeView} />
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
