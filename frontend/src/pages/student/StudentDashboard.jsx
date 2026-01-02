import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

/**
 * StudentDashboard - Pure Display Component
 * 
 * NO LOGIC HERE - Just displays backend-processed data
 * All filtering, sorting, calculations done by backend
 */
const StudentDashboard = () => {
    const { user } = useAuth();
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('calendar');

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!user) return;

            try {
                // Get student's course from profile
                const courseId = user.student_profile?.course;

                if (!courseId) {
                    console.error("Student has no course assigned");
                    setLoading(false);
                    return;
                }

                // Fetch FORMATTED timetable from backend
                // Backend does ALL processing: grouping, sorting, coloring, etc.
                const response = await api.get(`timetable/formatted/?course_id=${courseId}&view=${viewMode}`);
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

        let content = "Student Timetable\n\n";
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
        link.download = 'student_timetable.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your schedule...</p>
                </div>
            </div>
        );
    }

    if (!timetableData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">No timetable data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="flex-1 overflow-auto ml-72">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Class Schedule</h1>
                            <p className="text-gray-500 mt-1">Academic Year 2024-2025 • Semester 1</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white rounded-xl font-semibold transition-all shadow-lg hover:bg-blue-800"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Schedule
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Controls */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* View Mode Toggle */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">View Mode</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`flex-1 px-3 py-2 rounded-lg font-bold transition-all ${viewMode === 'calendar'
                                                ? 'bg-blue-900 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Calendar
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex-1 px-3 py-2 rounded-lg font-bold transition-all ${viewMode === 'list'
                                                ? 'bg-blue-900 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        List
                                    </button>
                                </div>
                            </div>

                            {/* Next Class Card */}
                            {timetableData.next_class && (
                                <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl">
                                    <p className="text-xs font-bold uppercase tracking-wide text-blue-300 mb-4">
                                        Up Next
                                    </p>
                                    <h4 className="text-xl font-bold mb-4">{timetableData.next_class.subject}</h4>
                                    <div className="flex items-center gap-3 text-sm bg-white/10 p-3 rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="text-blue-300 text-xs">Room</span>
                                            <span>{timetableData.next_class.classroom}</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10"></div>
                                        <div className="flex flex-col">
                                            <span className="text-blue-300 text-xs">Time</span>
                                            <span>{timetableData.next_class.start_time}</span>
                                        </div>
                                        {timetableData.next_class.minutes_until && (
                                            <>
                                                <div className="w-px h-8 bg-white/10"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-blue-300 text-xs">In</span>
                                                    <span>{timetableData.next_class.minutes_until} min</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {viewMode === 'calendar' ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Calendar Header */}
                                    <div className="grid grid-cols-6 border-b border-gray-100 bg-gray-50">
                                        <div className="p-4 border-r border-gray-100"></div>
                                        {timetableData.days.map((day, index) => (
                                            <div key={day.day} className="p-4 text-center border-l border-gray-100">
                                                <div className="text-xs font-bold text-gray-400 uppercase">{day.day.substring(0, 3)}</div>
                                                <div className="text-2xl font-bold text-gray-700">{index + 1}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="relative">
                                        <div className="grid grid-cols-6">
                                            {/* Time Column */}
                                            <div className="border-r border-gray-100 bg-gray-50">
                                                {timetableData.time_range.slots.map(time => (
                                                    <div key={time} className="h-20 border-b border-gray-50 px-4 py-3 text-xs font-bold text-gray-400">
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Day Columns */}
                                            {timetableData.days.map(day => (
                                                <div key={day.day} className="relative border-l border-gray-100">
                                                    {timetableData.time_range.slots.map(time => (
                                                        <div key={time} className="h-20 border-b border-gray-50"></div>
                                                    ))}

                                                    {/* Classes - Backend provides position and styling */}
                                                    {day.classes.map(cls => (
                                                        <div
                                                            key={cls.id}
                                                            className={`absolute left-1 right-1 ${cls.display.color_class} rounded-lg p-2 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer`}
                                                            style={{
                                                                top: `${cls.display.position_index * 80}px`,
                                                                height: `${cls.display.duration_blocks * 80}px`
                                                            }}
                                                        >
                                                            <div className="text-xs font-bold opacity-60 mb-1">
                                                                {cls.time.start} - {cls.time.end}
                                                            </div>
                                                            <div className="text-sm font-semibold mb-2">
                                                                {cls.subject.name}
                                                            </div>
                                                            <div className="text-xs opacity-80">
                                                                {cls.classroom.room_number}
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
                                    {timetableData.days.map(day => (
                                        <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-gray-900">{day.day}</h3>
                                                <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                                                    {day.class_count} Classes
                                                </span>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {day.has_classes ? (
                                                    day.classes.map(cls => (
                                                        <div key={cls.id} className="p-8 hover:bg-gray-50 transition-all flex items-center gap-8">
                                                            <div className="w-24 text-center">
                                                                <p className="text-lg font-bold text-blue-900">{cls.time.start}</p>
                                                                <p className="text-sm text-gray-500">to {cls.time.end}</p>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-xl font-bold text-gray-900 mb-2">{cls.subject.name}</h4>
                                                                <div className="flex items-center gap-6 text-sm">
                                                                    <span className="flex items-center gap-2 text-gray-500">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                        </svg>
                                                                        Room {cls.classroom.room_number}
                                                                    </span>
                                                                    <span className="text-gray-500">
                                                                        {cls.subject.lecturer_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center text-gray-400">
                                                        No classes scheduled for {day.day}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
