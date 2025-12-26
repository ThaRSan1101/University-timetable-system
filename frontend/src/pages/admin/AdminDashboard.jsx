import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0); // Mock progress

    // Mock Stats Data
    const stats = [
        { title: 'Total Courses', value: '142', trend: '+2% from last sem', icon: 'book', color: 'blue' },
        { title: 'Registered Lecturers', value: '56', trend: '+1% new hires', icon: 'users', color: 'purple' },
        { title: 'Rooms Available', value: '24', trend: 'Utilization: 85%', icon: 'building', color: 'orange' },
        { title: 'Pending Conflicts', value: '3', trend: 'Requires attention', icon: 'warning', color: 'red', warning: true },
    ];

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage('');
        setProgress(0);

        // Mock progress animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return prev;
                return prev + 5;
            });
        }, 500);

        try {
            const response = await api.post('timetable/generate/');
            clearInterval(interval);
            setProgress(100);

            if (response.data.status === 'success') {
                setMessage('Timetable generated successfully!');
                setTimeout(() => setGenerating(false), 2000);
            } else {
                setMessage(`Generated with conflicts: ${response.data.unscheduled.length} unscheduled items.`);
                setGenerating(false);
            }
        } catch {
            clearInterval(interval);
            setMessage('Error generating timetable.');
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />

            <div className="flex-1 ml-72 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-bold text-gray-800">Fall 2024 Semester</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Search courses, rooms..."
                                className="bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg relative">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900 leading-none">Admin User</p>
                                <p className="text-gray-500 text-xs mt-0.5">Registrar Office</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-8 flex-1 overflow-auto">

                    {/* Page Header */}
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
                            <p className="text-gray-500 flex items-center gap-2 text-sm">
                                System Status: <span className="font-semibold text-green-600">Nominal</span> • Last update: 2 mins ago
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export Report
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {generating ? 'Processing...' : 'Start Generation'}
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`bg-white p-6 rounded-xl border ${stat.warning ? 'border-red-200 border-l-4 border-l-red-500' : 'border-gray-200'} shadow-sm`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                                        {stat.icon === 'book' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                        {stat.icon === 'users' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                                        {stat.icon === 'building' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m-1 0h7m-5 4v-3" /></svg>}
                                        {stat.icon === 'warning' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                                    </div>
                                </div>
                                <p className={`text-xs font-semibold ${stat.warning ? 'text-red-500' : 'text-green-600'}`}>
                                    {stat.warning && <span className="mr-1">!</span>}
                                    {stat.trend}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Generator Progress - Only show when generating or recently finished */}
                    {(generating || message) && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${generating ? 'bg-blue-100 text-blue-600 animate-spin' : 'bg-green-100 text-green-600'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{generating ? 'Generating Timetable Draft v3.1' : message}</h3>
                                        <p className="text-sm text-gray-500">Genetic Algorithm • Iteration {Math.floor(progress * 100)}/10000</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Started: {new Date().toLocaleTimeString()} by Admin</span>
                                <span>Est. time remaining: {generating ? '2m 30s' : 'Completed'}</span>
                            </div>
                        </div>
                    )}

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="space-y-8">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <a href="/admin/courses" className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-center transition-colors group">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">Add Course</span>
                                    </a>
                                    <a href="/admin/lecturers" className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-center transition-colors group">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">Add Lecturer</span>
                                    </a>
                                    <a href="/admin/classrooms" className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-center transition-colors group">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">Block Room</span>
                                    </a>
                                    <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-center transition-colors group">
                                        <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">Review Draft</span>
                                    </button>
                                </div>
                            </div>

                            {/* Upcoming Deadlines */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">Upcoming Deadlines</h3>
                                    <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-blue-500">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Lecturer Availability Submission</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Due in 2 days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-blue-500">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Room Maintenance Schedule</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Due in 5 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Attention Needed */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-900">Attention Needed</h3>
                                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">3 Issues</span>
                                </div>
                                <div className="flex gap-2 text-gray-400">
                                    <button className="hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg></button>
                                    <button className="hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                            <th className="px-6 py-4">Severity</th>
                                            <th className="px-6 py-4">Conflict Type</th>
                                            <th className="px-6 py-4">Details</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50 group">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Critical
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">Double Booking</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">Room 304 (Lab)</p>
                                                <p className="text-xs text-gray-500">CS101 & ENG202 on Mon 9AM</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Resolve</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 group">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Moderate
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">Capacity Overflow</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">Auditorium A</p>
                                                <p className="text-xs text-gray-500">Course enrollment (120) {'>'} Room Cap (100)</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Resolve</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 group">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Low
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">Soft Constraint</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">Prof. Smith</p>
                                                <p className="text-xs text-gray-500">Preferred no classes after 4PM</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-gray-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ignore</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-gray-100 text-center">
                                <button className="text-sm text-gray-500 font-semibold hover:text-gray-700">View All Conflicts</button>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
