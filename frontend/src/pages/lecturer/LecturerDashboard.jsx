import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LecturerSidebar from '../../components/LecturerSidebar';

/**
 * LecturerDashboard - Pure Display Component
 * 
 * NO LOGIC HERE - Just displays backend-processed data
 */
const LecturerDashboard = () => {
    const { user } = useAuth();
    const [timetableData, setTimetableData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('calendar');

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!user) return;

            try {
                // Fetch FORMATTED timetable for this lecturer
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
                <p className="text-gray-600">No schedule data available</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LecturerSidebar />

            <div className="flex-1 overflow-auto ml-72">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Faculty Schedule Overview</h1>
                            <p className="text-gray-500 mt-1">Academic Year 2024-2025 • Semester 1</p>
                        </div>
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

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* View Mode */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">View Mode</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('calendar')}
                                        className={`flex-1 px-3 py-2 rounded-lg font-bold ${viewMode === 'calendar'
                                                ? 'bg-blue-900 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        Calendar
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex-1 px-3 py-2 rounded-lg font-bold ${viewMode === 'list'
                                                ? 'bg-blue-900 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        List
                                    </button>
                                </div>
                            </div>

                            {/* Next Class */}
                            {timetableData.next_class && (
                                <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl">
                                    <p className="text-xs font-bold uppercase text-blue-300 mb-4">Up Next</p>
                                    <h4 className="text-xl font-bold mb-4">{timetableData.next_class.subject}</h4>
                                    <div className="flex items-center gap-3 text-sm bg-white/10 p-3 rounded-xl">
                                        <div>
                                            <span className="text-blue-300 text-xs block">Room</span>
                                            <span>{timetableData.next_class.classroom}</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/10"></div>
                                        <div>
                                            <span className="text-blue-300 text-xs block">Time</span>
                                            <span>{timetableData.next_class.start_time}</span>
                                        </div>
                                        {timetableData.next_class.minutes_until && (
                                            <>
                                                <div className="w-px h-8 bg-white/10"></div>
                                                <div>
                                                    <span className="text-blue-300 text-xs block">In</span>
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

                                            {timetableData.days.map(day => (
                                                <div key={day.day} className="relative border-l border-gray-100">
                                                    {timetableData.time_range.slots.map(time => (
                                                        <div key={time} className="h-20 border-b border-gray-50"></div>
                                                    ))}

                                                    {day.classes.map(cls => (
                                                        <div
                                                            key={cls.id}
                                                            className={`absolute left-1 right-1 ${cls.display.color_class} rounded-lg p-2 border-l-4 shadow-sm`}
                                                            style={{
                                                                top: `${cls.display.position_index * 80}px`,
                                                                height: `${cls.display.duration_blocks * 80}px`
                                                            }}
                                                        >
                                                            <div className="text-xs font-bold opacity-60">
                                                                {cls.time.start} - {cls.time.end}
                                                            </div>
                                                            <div className="text-sm font-semibold">
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
                                        <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                            <div className="px-8 py-4 bg-gray-50 border-b flex justify-between">
                                                <h3 className="text-lg font-bold">{day.day}</h3>
                                                <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                                                    {day.class_count} Sessions
                                                </span>
                                            </div>
                                            <div className="divide-y">
                                                {day.has_classes ? (
                                                    day.classes.map(cls => (
                                                        <div key={cls.id} className="p-8 hover:bg-gray-50 flex gap-8">
                                                            <div className="w-24 text-center">
                                                                <p className="text-2xl font-bold text-blue-900">{cls.time.start}</p>
                                                                <p className="text-xs text-gray-400">to {cls.time.end}</p>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-xl font-bold text-gray-900 mb-2">{cls.subject.name}</h4>
                                                                <div className="flex gap-6 text-sm text-gray-500">
                                                                    <span>Room {cls.classroom.room_number}</span>
                                                                    <span>{cls.subject.course_name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 text-center text-gray-400">
                                                        No classes on {day.day}
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

export default LecturerDashboard;
