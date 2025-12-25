import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [selectedDepartments, setSelectedDepartments] = useState(['Computer Science', 'Mathematics']);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const profileRes = await api.get(`students/?user=${user.id}`);
                if (profileRes.data.length > 0) {
                    const studentProfile = profileRes.data[0];
                    setProfile(studentProfile);
                    const response = await api.get(`timetable/?course_id=${studentProfile.course}&year=${studentProfile.year}&semester=${studentProfile.semester}`);
                    setTimetable(response.data);
                }
            } catch (error) {
                console.error("Error fetching timetable", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchTimetable();
    }, [user]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);

    const getDayClasses = (day) => {
        return timetable.filter(slot => slot.day === day);
    };

    const getClassPosition = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startHour = 9;
        return ((hours - startHour) * 60 + minutes) / 60;
    };

    const getClassDuration = (startTime, endTime) => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        return ((endHours * 60 + endMinutes) - (startHours * 60 + startMinutes)) / 60;
    };

    const getNextClass = () => {
        const now = new Date();
        const currentDay = days[now.getDay() - 1];
        const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        const todayClasses = getDayClasses(currentDay);
        const upcoming = todayClasses.find(slot => slot.start_time > currentTime);

        if (upcoming) {
            const timeDiff = new Date(`2000-01-01 ${upcoming.start_time}`) - new Date(`2000-01-01 ${currentTime}`);
            const minutes = Math.floor(timeDiff / 60000);
            return { ...upcoming, minutesUntil: minutes };
        }
        return null;
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

    const nextClass = getNextClass();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your timetable...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 fixed left-0 top-0 h-screen overflow-y-auto">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-blue-600 rounded-lg p-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">UniPortal</span>
                </div>

                {/* Navigation */}
                <div className="space-y-1 mb-8">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Academic</h3>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Timetable
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Courses
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Grades
                    </a>
                    <a href="/profile" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                    </a>
                </div>

                {/* Logout Button */}
                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto ml-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Semester Timetable</h1>
                            <p className="text-gray-500 mt-1">Fall Semester 2024 • Week 5</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filters
                                    </div>
                                    <button className="text-blue-600 text-sm font-medium">Reset</button>
                                </div>

                                {/* Semester Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">SEMESTER</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Fall 2024</option>
                                        <option>Spring 2024</option>
                                    </select>
                                </div>

                                {/* View Mode */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">VIEW MODE</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewMode('calendar')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium ${viewMode === 'calendar'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Calendar
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium ${viewMode === 'list'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                            </svg>
                                            List
                                        </button>
                                    </div>
                                </div>

                                {/* Search Course */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">FIND COURSE</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="e.g. CS101"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Next Class Card */}
                            {nextClass && (
                                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mt-6">
                                    <div className="flex items-center gap-2 text-blue-600 font-semibold mb-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Next Class
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <p className="text-sm text-gray-500 mb-1">In {nextClass.minutesUntil} mins</p>
                                        <p className="font-bold text-gray-900 mb-1">{nextClass.subject_details.name}</p>
                                        <p className="text-sm text-gray-600">Room {nextClass.classroom_details.room_number} • {nextClass.subject_details.lecturer_name}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Calendar View */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Week Days Header */}
                                <div className="grid grid-cols-6 border-b border-gray-200">
                                    <div className="p-4 bg-gray-50"></div>
                                    {days.map((day, index) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() - date.getDay() + index + 1);
                                        const isToday = date.toDateString() === new Date().toDateString();

                                        return (
                                            <div key={day} className="p-4 text-center border-l border-gray-200">
                                                <div className="text-xs text-gray-500 uppercase mb-1">{day.substring(0, 3)}</div>
                                                <div className={`text-2xl font-bold ${isToday ? 'bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto' : 'text-gray-900'}`}>
                                                    {date.getDate()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Time Grid */}
                                <div className="relative">
                                    <div className="grid grid-cols-6">
                                        {/* Time Column */}
                                        <div className="border-r border-gray-200">
                                            {timeSlots.map(time => (
                                                <div key={time} className="h-20 border-b border-gray-100 px-3 py-2 text-xs text-gray-500">
                                                    {time}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Days Columns */}
                                        {days.map(day => (
                                            <div key={day} className="relative border-l border-gray-200">
                                                {timeSlots.map(time => (
                                                    <div key={time} className="h-20 border-b border-gray-100"></div>
                                                ))}

                                                {/* Classes */}
                                                {getDayClasses(day).map(slot => {
                                                    const top = getClassPosition(slot.start_time) * 80; // 80px per hour
                                                    const height = getClassDuration(slot.start_time, slot.end_time) * 80;
                                                    const colorClass = getColorForSubject(slot.subject_details.name);

                                                    return (
                                                        <div
                                                            key={slot.id}
                                                            className={`absolute left-1 right-1 ${colorClass} rounded-lg p-2 border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                                                            style={{ top: `${top}px`, height: `${height}px` }}
                                                        >
                                                            <div className="text-xs font-bold mb-1 truncate">
                                                                {slot.subject_details.name}
                                                            </div>
                                                            <div className="text-xs opacity-90 mb-1">
                                                                Room {slot.classroom_details.room_number}
                                                            </div>
                                                            <div className="text-xs opacity-75">
                                                                {slot.start_time} - {slot.end_time}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
