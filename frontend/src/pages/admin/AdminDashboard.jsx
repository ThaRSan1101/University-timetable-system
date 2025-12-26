import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0); // Mock progress
    const [showPublishButton, setShowPublishButton] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [timetable, setTimetable] = useState([]);

    const dummyTimetable = [
        {
            id: 1,
            day: 'Monday',
            start_time: '09:00',
            end_time: '11:00',
            subject_details: { name: 'Advanced Algorithms', lecturer_name: 'Dr. Aruna Perera' },
            classroom_details: { room_number: 'Lab 01' }
        },
        {
            id: 2,
            day: 'Monday',
            start_time: '13:00',
            end_time: '15:00',
            subject_details: { name: 'Database Systems', lecturer_name: 'Prof. Kamal Silva' },
            classroom_details: { room_number: 'Hall A' }
        },
        {
            id: 3,
            day: 'Tuesday',
            start_time: '10:00',
            end_time: '12:00',
            subject_details: { name: 'Machine Learning', lecturer_name: 'Dr. Sarah Smith' },
            classroom_details: { room_number: 'Room 304' }
        },
        {
            id: 4,
            day: 'Wednesday',
            start_time: '09:00',
            end_time: '11:00',
            subject_details: { name: 'Software Engineering', lecturer_name: 'Mr. John Doe' },
            classroom_details: { room_number: 'Web Lab' }
        },
        {
            id: 5,
            day: 'Thursday',
            start_time: '14:00',
            end_time: '16:00',
            subject_details: { name: 'Computer Networks', lecturer_name: 'Dr. Saman Kumara' },
            classroom_details: { room_number: 'Hall B' }
        },
        {
            id: 6,
            day: 'Friday',
            start_time: '11:00',
            end_time: '13:00',
            subject_details: { name: 'Mobile Computing', lecturer_name: 'Ms. Janaki Liyanage' },
            classroom_details: { room_number: 'Lab 02' }
        }
    ];

    useEffect(() => {
        // Fetch or set dummy
        setTimetable(dummyTimetable);
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);

    const getDayClasses = (day) => {
        return timetable.filter(slot => slot.day === day);
    };

    const getClassPosition = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startHour = 9;
        return ((hours - startHour) * 60 + (minutes || 0)) / 60;
    };

    const getClassDuration = (startTime, endTime) => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        return ((endHours * 60 + (endMinutes || 0)) - (startHours * 60 + (startMinutes || 0))) / 60;
    };

    const formatTime = (time) => {
        if (!time) return '';
        return time.slice(0, 5);
    };

    const colors = [
        'bg-blue-100 border-blue-500 text-blue-700',
        'bg-green-100 border-green-500 text-green-700',
        'bg-purple-100 border-purple-500 text-purple-700',
        'bg-orange-100 border-orange-500 text-orange-700',
        'bg-pink-100 border-pink-500 text-pink-700',
        'bg-teal-100 border-teal-500 text-teal-700',
    ];

    const getColorForSubject = (subjectName) => {
        const hash = subjectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

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
        setShowPublishButton(false);

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
                setShowPublishButton(true);
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

    const handlePublish = async () => {
        setPublishing(true);
        try {
            // Mock API call to publish
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessage('Schedule published successfully to all users!');
            setShowPublishButton(false);
        } catch {
            setMessage('Failed to publish schedule.');
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <AdminSidebar />

            <div className="flex-1 ml-72 flex flex-col min-h-screen">
                <main className="p-8 flex-1 overflow-auto">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
                            <p className="text-gray-500 flex items-center gap-2 text-sm">
                                System Status: <span className="font-semibold text-green-600">Nominal</span> • Last update: 2 mins ago
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg relative mr-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            <button className="px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm font-semibold text-blue-900 hover:bg-blue-100 flex items-center gap-2 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export Schedule
                            </button>

                            {showPublishButton && (
                                <button
                                    onClick={handlePublish}
                                    disabled={publishing}
                                    className="px-4 py-2 bg-green-600 rounded-lg text-sm font-semibold text-white hover:bg-green-700 flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-70"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    {publishing ? 'Publishing...' : 'Publish Schedule'}
                                </button>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="px-4 py-2 bg-blue-900 rounded-lg text-sm font-semibold text-white hover:bg-blue-800 flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {generating ? 'Processing...' : 'Start Generation'}
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className={`bg-white p-6 rounded-xl border ${stat.warning ? 'border-red-200 border-l-4 border-l-red-500' : 'border-gray-200'} shadow-sm transition-all hover:shadow-md`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                                        <h3 className="text-3xl font-bold text-blue-900">{stat.value}</h3>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
                                        {stat.icon === 'book' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                        {stat.icon === 'users' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                                        {stat.icon === 'building' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m-1 0h7m-5 4v-3" /></svg>}
                                        {stat.icon === 'warning' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                                    </div>
                                </div>
                                <p className={`text-xs font-semibold ${stat.warning ? 'text-red-500' : 'text-blue-600'}`}>
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
                                    <div className={`p-3 rounded-lg ${generating ? 'bg-blue-100 text-blue-900 animate-spin' : 'bg-green-100 text-green-700'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-blue-900">{generating ? 'Generating Timetable Draft v3.1' : message}</h3>
                                        <p className="text-sm text-gray-500 font-medium">Genetic Algorithm • Iteration {Math.floor(progress * 100)}/10000</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-blue-900">{progress}%</span>
                            </div>
                            <div className="w-full bg-blue-50 rounded-full h-2.5 mb-2 overflow-hidden border border-blue-100">
                                <div className="bg-blue-900 h-2.5 rounded-full transition-all duration-300 shadow-sm" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Started: {new Date().toLocaleTimeString()} by Admin</span>
                                <span>Est. time remaining: {generating ? '2m 30s' : 'Completed'}</span>
                            </div>
                        </div>
                    )}

                    {/* Bottom Section */}
                    <div className="space-y-8">
                        {/* Attention Needed */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[400px]">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-900">Attention Needed</h3>
                                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">3 Issues</span>
                                </div>
                                <div className="flex gap-2 text-gray-400">
                                    <button className="hover:text-gray-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg></button>
                                    <button className="hover:text-gray-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-blue-50 text-xs text-blue-900 uppercase font-bold border-b border-blue-100">
                                            <th className="px-6 py-4">Severity</th>
                                            <th className="px-6 py-4">Conflict Type</th>
                                            <th className="px-6 py-4">Details</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50 group transition-colors">
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
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-bold">Resolve</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 group transition-colors">
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
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-bold">Resolve</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 group transition-colors">
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
                                                <button className="text-gray-400 hover:text-gray-600 text-sm font-bold">Ignore</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-gray-100 text-center">
                                <button className="text-sm text-gray-500 font-semibold hover:text-gray-700 transition-colors">View All Conflicts</button>
                            </div>
                        </div>
                        {/* University Schedule Preview */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">University Schedule Preview</h3>
                                    <p className="text-sm text-gray-500 font-medium italic">Viewing Master Timetable • Semester 1</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setViewMode('calendar')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                                            Calendar
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                            List
                                        </button>
                                    </div>

                                    <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

                                    <select className="px-3 py-2 bg-blue-50 border border-blue-100 text-blue-900 text-xs font-bold rounded-lg outline-none focus:ring-2 focus:ring-blue-900 transition-all">
                                        <option>BSc Computer Science</option>
                                        <option>BSc Engineering</option>
                                        <option>BSc Management</option>
                                    </select>
                                    <select className="px-3 py-2 bg-blue-50 border border-blue-100 text-blue-900 text-xs font-bold rounded-lg outline-none focus:ring-2 focus:ring-blue-900 transition-all">
                                        <option>Year 1</option>
                                        <option>Year 2</option>
                                        <option>Year 3</option>
                                        <option>Year 4</option>
                                    </select>
                                </div>
                            </div>

                            {viewMode === 'calendar' ? (
                                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-inner">
                                    <div className="grid grid-cols-6 bg-blue-50/50">
                                        <div className="p-4 flex items-center justify-center border-r border-gray-100">
                                            <svg className="w-5 h-5 text-blue-900/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        {days.map(day => (
                                            <div key={day} className="p-4 text-center border-l border-gray-100">
                                                <span className="text-[11px] font-bold text-blue-900/60 uppercase tracking-widest leading-none block mb-1">{day.substring(0, 3)}</span>
                                                <span className="text-sm font-bold text-blue-900">Day</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative overflow-x-auto">
                                        <div className="min-w-[800px]">
                                            <div className="grid grid-cols-6">
                                                <div className="bg-white border-r border-gray-100 last:border-b-0">
                                                    {timeSlots.map(time => (
                                                        <div key={time} className="h-20 border-b border-gray-50 px-4 py-2 text-xs font-bold text-blue-900/40">
                                                            {time}
                                                        </div>
                                                    ))}
                                                </div>

                                                {days.map(day => (
                                                    <div key={day} className="relative border-l border-gray-50 group">
                                                        {timeSlots.map(time => (
                                                            <div key={time} className="h-20 border-b border-gray-50 flex items-center justify-center">
                                                                <div className="w-1.5 h-1.5 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            </div>
                                                        ))}

                                                        {getDayClasses(day).map(slot => {
                                                            const top = getClassPosition(slot.start_time) * 80;
                                                            const height = getClassDuration(slot.start_time, slot.end_time) * 80;
                                                            const colorClass = getColorForSubject(slot.subject_details.name);

                                                            return (
                                                                <div
                                                                    key={slot.id}
                                                                    className={`absolute left-1 right-1 ${colorClass} rounded-xl p-3 border-l-4 shadow-sm hover:shadow-xl transition-all cursor-pointer z-10 hover:-translate-y-0.5 overflow-hidden group/item`}
                                                                    style={{ top: `${top}px`, height: `${height}px` }}
                                                                >
                                                                    <div className="text-xs font-bold mb-1 truncate leading-tight">
                                                                        {slot.subject_details.name}
                                                                    </div>
                                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                                        <div className="flex items-center gap-1 text-[10px] font-bold opacity-80">
                                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                            Room {slot.classroom_details.room_number}
                                                                        </div>
                                                                        <div className="text-[10px] font-bold opacity-60">
                                                                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {days.map(day => {
                                        const classes = getDayClasses(day).sort((a, b) => a.start_time.localeCompare(b.start_time));
                                        return (
                                            <div key={day} className="bg-white">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest">{day}</h4>
                                                    <div className="flex-1 h-[1px] bg-blue-50"></div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {classes.length > 0 ? (
                                                        classes.map(slot => (
                                                            <div key={slot.id} className="p-4 bg-gray-50 hover:bg-white rounded-2xl border border-transparent hover:border-blue-100 transition-all group flex items-start gap-4 shadow-sm hover:shadow-md">
                                                                <div className="w-16 h-16 bg-blue-900 rounded-xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/20">
                                                                    <span className="text-xs font-bold leading-none">{formatTime(slot.start_time).split(':')[0]}</span>
                                                                    <span className="text-[8px] font-bold opacity-50 uppercase mt-0.5">Start</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0 py-1">
                                                                    <div className="flex justify-between items-start mb-1">
                                                                        <h5 className="font-bold text-blue-900 truncate pr-2">{slot.subject_details.name}</h5>
                                                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Lec {slot.classroom_details.room_number}</span>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                                                                        <span className="flex items-center gap-1.5">
                                                                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                                            {slot.subject_details.lecturer_name}
                                                                        </span>
                                                                        <span className="flex items-center gap-1.5 text-blue-900 font-bold">
                                                                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                            <p className="text-sm font-semibold text-gray-400 italic">No academic sessions scheduled</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
