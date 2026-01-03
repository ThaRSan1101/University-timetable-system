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
    const [searchTerm, setSearchTerm] = useState('');
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);

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

                // Extract available semesters from the fetched data
                const semesters = [...new Set(response.data.days.flatMap(day =>
                    day.classes.map(cls => cls.subject.semester)
                ))].sort((a, b) => a - b);

                setAvailableSemesters(semesters);

                // Set default semester selection if none selected
                if (semesters.length > 0 && !selectedSemester) {
                    setSelectedSemester(semesters[0]);
                }
            } catch (error) {
                console.error("Error fetching timetable", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, [user, viewMode]);

    // Derived state for filtered filteredDays to check if empty
    const filteredDays = timetableData?.days.map(day => ({
        ...day,
        classes: day.classes.filter(cls => {
            const matchesSearch = !searchTerm ||
                cls.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cls.subject.code.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSemester = !selectedSemester || cls.subject.semester === parseInt(selectedSemester);
            return matchesSearch && matchesSemester;
        })
    })) || [];

    // Check if there are any classes at all in the current selection
    const hasAnyClasses = filteredDays.some(day => day.classes.length > 0);

    const handleExport = () => {
        if (!timetableData) return;

        let content = "Student Timetable\n\n";
        filteredDays.forEach(day => {
            if (day.classes.length > 0) {
                content += `${day.day}:\n`;
                day.classes.forEach(cls => {
                    content += `  ${cls.time.start}-${cls.time.end} ${cls.subject.name} (${cls.subject.code}) - Room ${cls.classroom.room_number}\n`;
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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="flex-1 overflow-auto ml-72">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading your schedule...</p>
                        </div>
                    </div>
                ) : !timetableData || !timetableData.time_range || !timetableData.time_range.slots || !timetableData.days ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-600 font-medium mb-2">No timetable data available</p>
                            <p className="text-gray-400 text-sm">Please contact your administrator to generate a timetable.</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Class Schedule</h1>
                                <p className="text-gray-500 mt-1">
                                    {selectedSemester ? `Semester ${selectedSemester}` : ' All Semesters'} • Academic Year 2024-2025
                                </p>
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
                                {/* Filters Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                            <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setViewMode('calendar');
                                                setSearchTerm('');
                                                if (availableSemesters.length > 0) setSelectedSemester(availableSemesters[0]);
                                            }}
                                            className="text-sm font-bold text-blue-900 hover:text-blue-700"
                                        >
                                            Reset
                                        </button>
                                    </div>

                                    {/* Semester Filter */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Semester</label>
                                        <div className="relative">
                                            <select
                                                value={selectedSemester || ''}
                                                onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                                                disabled={availableSemesters.length === 0}
                                                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 font-semibold rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                                            >
                                                {availableSemesters.length === 0 ? (
                                                    <option>No data available</option>
                                                ) : (
                                                    availableSemesters.map(sem => (
                                                        <option key={sem} value={sem}>Semester {sem}</option>
                                                    ))
                                                )}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* View Mode */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">View Mode</label>
                                        <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                            <button
                                                onClick={() => setViewMode('calendar')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-bold transition-all ${viewMode === 'calendar'
                                                    ? 'bg-blue-900 text-white shadow-md'
                                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Calendar
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-bold transition-all ${viewMode === 'list'
                                                    ? 'bg-blue-900 text-white shadow-md'
                                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                                List
                                            </button>
                                        </div>
                                    </div>

                                    {/* Find Module */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Find Module</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="e.g. CS101"
                                                className="w-full bg-white border border-gray-200 text-gray-900 font-medium rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent placeholder-gray-400"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            </div>
                                        </div>
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

                                                {/* Day Columns - Render filtered classes */}
                                                {filteredDays.map(day => (
                                                    <div key={day.day} className="relative border-l border-gray-100">
                                                        {timetableData.time_range.slots.map(time => (
                                                            <div key={time} className="h-20 border-b border-gray-50"></div>
                                                        ))}

                                                        {day.classes.map(cls => (
                                                            <div
                                                                key={cls.id}
                                                                className={`absolute left-1 right-1 ${cls.display.color_class} rounded-lg p-2 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden group`}
                                                                style={{
                                                                    top: `${cls.display.position_index * 80 + 2}px`,
                                                                    height: `${cls.display.duration_blocks * 80 - 4}px`,
                                                                    zIndex: 10
                                                                }}
                                                            >
                                                                <div className="flex-1 min-h-0 flex flex-col gap-0.5">
                                                                    <div className="text-[10px] font-extrabold opacity-70 uppercase tracking-wider">
                                                                        {cls.subject.code}
                                                                    </div>
                                                                    <div className="text-xs font-bold leading-tight line-clamp-3">
                                                                        {cls.subject.name}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-1 pt-1.5 border-t border-black/5 flex flex-col gap-0.5">
                                                                    <div className="text-[10px] font-medium flex items-center gap-1 opacity-90">
                                                                        <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                                        <span className="truncate">{cls.subject.lecturer_name || 'TBA'}</span>
                                                                    </div>
                                                                    <div className="text-[10px] font-medium flex items-center gap-1 opacity-90">
                                                                        <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                                        <span className="truncate">{cls.classroom.room_number}</span>
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
                                        {!hasAnyClasses && (
                                            <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-gray-200">
                                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-lg font-medium">No classes found for this semester.</p>
                                                <p>Try selecting a different semester from the filters.</p>
                                            </div>
                                        )}

                                        {filteredDays.map(day => day.classes.length > 0 && (
                                            <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                                <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                                    <h3 className="text-lg font-bold text-gray-900">{day.day}</h3>
                                                    <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">
                                                        {day.classes.length} Classes
                                                    </span>
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {day.classes.map(cls => (
                                                        <div key={cls.id} className="p-8 hover:bg-gray-50 transition-all flex items-center gap-8">
                                                            <div className="w-24 text-center">
                                                                <p className="text-lg font-bold text-blue-900">{cls.time.start}</p>
                                                                <p className="text-sm text-gray-500">to {cls.time.end}</p>
                                                            </div>
                                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase tracking-wider">
                                                                            {cls.subject.code}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-xl font-bold text-gray-900 mb-1">{cls.subject.name}</h4>
                                                                    <p className="text-sm text-gray-500">{cls.subject.course_name}</p>
                                                                </div>

                                                                <div className="flex flex-col justify-center gap-2 text-sm text-gray-600">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-900">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                                        </div>
                                                                        <div>
                                                                            <span className="block text-xs font-bold text-gray-400 uppercase">Lecturer</span>
                                                                            <span className="font-medium text-gray-900">{cls.subject.lecturer_name || 'TBA'}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-900">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                                        </div>
                                                                        <div>
                                                                            <span className="block text-xs font-bold text-gray-400 uppercase">Venue</span>
                                                                            <span className="font-medium text-gray-900">Room {cls.classroom.room_number}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
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

export default StudentDashboard;
