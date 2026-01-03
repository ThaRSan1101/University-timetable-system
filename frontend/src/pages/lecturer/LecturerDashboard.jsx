import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LecturerSidebar from '../../components/LecturerSidebar';

/**
 * LecturerDashboard - Modern Design with Filters
 */
const LecturerDashboard = () => {
    const { user } = useAuth();
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('calendar');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!user) return;

            try {
                const response = await api.get(`timetable/formatted/?lecturer_id=${user.id}&view=${viewMode}`);
                setTimetableData(response.data);
            } catch (error) {
                console.error("Error fetching timetable", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, [user, viewMode]);

    const handleExport = () => {
        if (!timetableData) return;

        let content = "Lecturer Schedule\n\n";
        timetableData.days.forEach(day => {
            if (day.has_classes) {
                content += `${day.day}:\n`;
                day.classes.forEach(cls => {
                    content += `  ${cls.time.start}-${cls.time.end} ${cls.subject.name} at ${cls.classroom.room_number}\n`;
                });
                content += '\n';
            }
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lecturer_schedule.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setSearchTerm('');
        setViewMode('calendar');
    };

    // Filter classes based on search
    const filteredDays = timetableData?.days.map(day => ({
        ...day,
        classes: day.classes.filter(cls =>
            !searchTerm ||
            cls.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.subject.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })) || [];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LecturerSidebar />

            <div className="flex-1 overflow-auto ml-72">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading your schedule...</p>
                        </div>
                    </div>
                ) : !timetableData ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-600">No schedule data available</p>
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Teaching Schedule</h1>
                                <p className="text-gray-500 mt-1">Academic Year 2024-2025</p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white rounded-xl font-semibold transition-all shadow-lg hover:bg-blue-800"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export Schedule
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Filter Sidebar */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Filters Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                        </div>
                                        <button
                                            onClick={handleReset}
                                            className="text-sm font-semibold text-blue-900 hover:text-blue-700 transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>

                                    {/* View Mode */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-gray-700 mb-3">VIEW MODE</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setViewMode('calendar')}
                                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${viewMode === 'calendar'
                                                    ? 'bg-blue-900 text-white shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Calendar
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${viewMode === 'list'
                                                    ? 'bg-blue-900 text-white shadow-md'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                                List
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Search */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">QUICK SEARCH</label>
                                        <div className="relative">
                                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <input
                                                type="text"
                                                placeholder="Code or Module..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Current Status Card */}
                                {timetableData.next_class && (
                                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <p className="text-xs font-bold uppercase text-blue-200 tracking-wider">Current Status</p>
                                        </div>
                                        <h4 className="text-sm font-medium text-blue-200 mb-1">Up Next in {timetableData.next_class.minutes_until || 0} mins</h4>
                                        <h3 className="text-2xl font-bold mb-4">{timetableData.next_class.subject}</h3>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-medium text-blue-200 mb-1">VENUE</p>
                                                <p className="font-bold">Room {timetableData.next_class.classroom}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-blue-200 mb-1">TIME</p>
                                                <p className="font-bold">{timetableData.next_class.start_time}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-3">
                                {viewMode === 'calendar' ? (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="grid grid-cols-6 border-b border-gray-100 bg-gray-50">
                                            <div className="p-4"></div>
                                            {timetableData.days.map((day, idx) => (
                                                <div key={day.day} className="p-4 text-center">
                                                    <div className="text-xs font-bold text-gray-400">{day.day.substring(0, 3)}</div>
                                                    <div className="text-2xl font-bold text-gray-700">{idx + 1}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative">
                                            <div className="grid grid-cols-6">
                                                <div className="border-r border-gray-100 bg-gray-50">
                                                    {timetableData.time_range.slots.map(time => (
                                                        <div key={time} className="h-20 border-b border-gray-50 px-4 py-3 text-xs font-bold text-gray-400">
                                                            {time}
                                                        </div>
                                                    ))}
                                                </div>

                                                {filteredDays.map(day => (
                                                    <div key={day.day} className="relative border-l border-gray-100">
                                                        {timetableData.time_range.slots.map(time => (
                                                            <div key={time} className="h-20 border-b border-gray-50"></div>
                                                        ))}

                                                        {day.classes.map(cls => (
                                                            <div
                                                                key={cls.id}
                                                                className={`absolute left-1 right-1 ${cls.display.color_class} rounded-lg p-2 border-l-4 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col overflow-hidden group hover:z-50`}
                                                                style={{
                                                                    top: `${cls.display.position_index * 80 + 2}px`,
                                                                    height: `${cls.display.duration_blocks * 80 - 4}px`,
                                                                    zIndex: 10
                                                                }}
                                                            >
                                                                {/* Main Card Content */}
                                                                <div className="flex-1 min-h-0 flex flex-col gap-0.5">
                                                                    <div className="text-[10px] font-extrabold opacity-70 uppercase tracking-wider">
                                                                        {cls.subject.code}
                                                                    </div>
                                                                    <div className="text-xs font-bold leading-tight line-clamp-2">
                                                                        {cls.subject.name}
                                                                    </div>
                                                                    <div className="text-[9px] font-medium opacity-60 mt-0.5">
                                                                        {cls.time.start} - {cls.time.end}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-1 pt-1.5 border-t border-black/5 flex flex-col gap-0.5">
                                                                    <div className="text-[10px] font-medium flex items-center gap-1 opacity-90">
                                                                        <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                                        <span className="truncate">RM {cls.classroom.room_number}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Hover Tooltip */}
                                                                <div className="absolute left-full ml-2 top-0 w-72 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                                    {/* Header */}
                                                                    <div className="mb-3 pb-3 border-b border-gray-100">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-xs font-bold uppercase tracking-wider">
                                                                                {cls.subject.code}
                                                                            </span>
                                                                        </div>
                                                                        <h4 className="text-base font-bold text-gray-900 leading-tight">{cls.subject.name}</h4>
                                                                        <p className="text-xs text-gray-500 mt-1">{cls.subject.course_name}</p>
                                                                    </div>

                                                                    {/* Details Grid */}
                                                                    <div className="space-y-2.5">
                                                                        {/* Time */}
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                                <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-xs text-gray-500 font-medium">Time</p>
                                                                                <p className="text-sm font-bold text-gray-900">{cls.time.start} - {cls.time.end}</p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Duration */}
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                                                <svg className="w-4 h-4 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-xs text-gray-500 font-medium">Duration</p>
                                                                                <p className="text-sm font-bold text-gray-900">{cls.display.duration_blocks} hour{cls.display.duration_blocks > 1 ? 's' : ''}</p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Classroom */}
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                                                                <svg className="w-4 h-4 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                                </svg>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-xs text-gray-500 font-medium">Classroom</p>
                                                                                <p className="text-sm font-bold text-gray-900">Room {cls.classroom.room_number}</p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Room Type */}
                                                                        {cls.classroom.room_type && (
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                                                    <svg className="w-4 h-4 text-orange-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                                                    </svg>
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <p className="text-xs text-gray-500 font-medium">Room Type</p>
                                                                                    <p className="text-sm font-bold text-gray-900">{cls.classroom.room_type}</p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {filteredDays.map(day => {
                                            const hasClasses = day.classes && day.classes.length > 0;
                                            return (
                                                <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                                    <div className="px-8 py-4 bg-gray-50 border-b flex justify-between items-center">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900">{day.day}</h3>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {hasClasses ? `${day.classes.length} class${day.classes.length > 1 ? 'es' : ''}` : 'No classes'}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-full">
                                                            {day.classes.length} Sessions
                                                        </span>
                                                    </div>
                                                    <div className="divide-y divide-gray-100">
                                                        {hasClasses ? (
                                                            day.classes.map(cls => (
                                                                <div key={cls.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                                    <div className="flex items-start gap-6">
                                                                        {/* Time */}
                                                                        <div className="flex-shrink-0 w-20 text-center">
                                                                            <div className="bg-blue-900 text-white rounded-xl p-3">
                                                                                <p className="text-lg font-bold leading-none">{cls.time.start}</p>
                                                                                <p className="text-[10px] opacity-70 mt-1">to</p>
                                                                                <p className="text-sm font-semibold leading-none">{cls.time.end}</p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Subject Details */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded text-xs font-bold uppercase tracking-wider">
                                                                                            {cls.subject.code}
                                                                                        </span>
                                                                                    </div>
                                                                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{cls.subject.name}</h4>
                                                                                    <p className="text-sm text-gray-500">{cls.subject.course_name}</p>
                                                                                </div>
                                                                            </div>

                                                                            {/* Location & Details */}
                                                                            <div className="flex flex-wrap gap-4 mt-3">
                                                                                <div className="flex items-center gap-2 text-sm">
                                                                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                                                                        <svg className="w-4 h-4 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-xs text-gray-500 font-medium">Classroom</p>
                                                                                        <p className="font-bold text-gray-900">Room {cls.classroom.room_number}</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="flex items-center gap-2 text-sm">
                                                                                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                                                                        <svg className="w-4 h-4 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                        </svg>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-xs text-gray-500 font-medium">Duration</p>
                                                                                        <p className="font-bold text-gray-900">{cls.display.duration_blocks} hour{cls.display.duration_blocks > 1 ? 's' : ''}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-12 text-center">
                                                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <p className="text-gray-400 font-medium">No classes scheduled for {day.day}</p>
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturerDashboard;
