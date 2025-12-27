import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LecturerSidebar from '../../components/LecturerSidebar';

const LecturerDashboard = () => {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

    const dummyTimetable = [
        {
            id: 1,
            day: 'Monday',
            start_time: '09:00',
            end_time: '11:00',
            subject_details: { name: 'Advanced Algorithms', course_name: 'Computer Science' },
            classroom_details: { room_number: 'Lab 01' }
        },
        {
            id: 2,
            day: 'Monday',
            start_time: '13:00',
            end_time: '15:00',
            subject_details: { name: 'Database Systems', course_name: 'Information Technology' },
            classroom_details: { room_number: 'Hall A' }
        },
        {
            id: 3,
            day: 'Tuesday',
            start_time: '10:00',
            end_time: '12:00',
            subject_details: { name: 'Machine Learning', course_name: 'Data Science' },
            classroom_details: { room_number: 'Room 304' }
        },
        {
            id: 4,
            day: 'Wednesday',
            start_time: '09:00',
            end_time: '12:00',
            subject_details: { name: 'Software Engineering', course_name: 'Software Engineering' },
            classroom_details: { room_number: 'Web Lab' }
        },
        {
            id: 5,
            day: 'Thursday',
            start_time: '14:00',
            end_time: '16:00',
            subject_details: { name: 'Computer Networks', course_name: 'Network Engineering' },
            classroom_details: { room_number: 'Hall B' }
        },
        {
            id: 6,
            day: 'Friday',
            start_time: '11:00',
            end_time: '13:00',
            subject_details: { name: 'Mobile Computing', course_name: 'Computer Science' },
            classroom_details: { room_number: 'Lab 02' }
        },
        {
            id: 7,
            day: 'Wednesday',
            start_time: '14:00',
            end_time: '15:00',
            subject_details: { name: 'Project Management', course_name: 'Business IT' },
            classroom_details: { room_number: 'Room 102' }
        }
    ];

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await api.get(`timetable/?lecturer_id=${user.id}`);
                // Merge API data with dummy data to ensure visibility during testing
                const apiData = response.data || [];
                const combinedData = [...apiData];

                // Add dummy data that doesn't overlap with API data (simple check)
                dummyTimetable.forEach(dummy => {
                    const exists = apiData.some(api => api.day === dummy.day && api.start_time === dummy.start_time);
                    if (!exists) combinedData.push(dummy);
                });

                setTimetable(combinedData);
            } catch (error) {
                console.error("Error fetching timetable, using dummy data", error);
                setTimetable(dummyTimetable);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchTimetable();
    }, [user]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`);

    const getDayClasses = (day) => {
        const classes = timetable.filter(slot => slot.day === day);
        if (classes.length === 0) return [];

        // Sort by start time to handle merging
        const sorted = [...classes].sort((a, b) => a.start_time.localeCompare(b.start_time));
        const merged = [];

        if (sorted.length > 0) {
            let current = { ...sorted[0] };
            for (let i = 1; i < sorted.length; i++) {
                const next = sorted[i];
                // Normalize times for comparison
                const currentEnd = formatTime(current.end_time);
                const nextStart = formatTime(next.start_time);

                // Merge if same subject name and back-to-back
                if (current.subject_details.name === next.subject_details.name &&
                    currentEnd === nextStart) {
                    current.end_time = next.end_time;
                } else {
                    merged.push(current);
                    current = { ...next };
                }
            }
            merged.push(current);
        }
        return merged;
    };

    const getClassPosition = (startTime) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startHour = 8;
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

    const getNextClass = () => {
        const now = new Date();
        const currentDay = days[now.getDay() - 1];
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const todayClasses = getDayClasses(currentDay);
        const upcoming = todayClasses
            .filter(slot => slot.start_time > currentTime)
            .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

        if (upcoming) {
            const [uH, uM] = upcoming.start_time.split(':').map(Number);
            const [cH, cM] = currentTime.split(':').map(Number);
            let minutes = (uH * 60 + uM) - (cH * 60 + cM);
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

    const handleExport = () => {
        const content = "Lecturer Schedule\n" + timetable.map(t => `${t.day}: ${t.start_time}-${t.end_time} ${t.subject_details.name} at ${t.classroom_details.room_number}`).join("\n");
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
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white rounded-xl font-semibold transition-all shadow-lg hover:bg-blue-800 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Schedule
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Control Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                        Filters
                                    </div>
                                    <button className="text-blue-900 text-sm font-bold hover:underline">Reset</button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">VIEW MODE</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setViewMode('calendar')}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${viewMode === 'calendar'
                                                    ? 'bg-blue-900 text-white shadow-lg'
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
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${viewMode === 'list'
                                                    ? 'bg-blue-900 text-white shadow-lg'
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

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">DEPARTMENT</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none text-sm font-medium">
                                            <option>All Modules</option>
                                            <option>CS - General</option>
                                            <option>IT - Specialized</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">QUICK SEARCH</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Code or Module..."
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none text-sm font-medium"
                                            />
                                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {nextClass && (
                                <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-300 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                            Current Status
                                        </p>
                                        <p className="text-sm font-medium text-blue-100 mb-1">Up Next in {nextClass.minutesUntil} mins</p>
                                        <h4 className="text-xl font-bold mb-4 leading-tight">{nextClass.subject_details.name}</h4>
                                        <div className="flex items-center gap-3 text-xs font-semibold bg-white/10 p-3 rounded-xl border border-white/10">
                                            <div className="flex flex-col">
                                                <span className="text-blue-300 uppercase text-[9px]">Venue</span>
                                                <span>Room {nextClass.classroom_details.room_number}</span>
                                            </div>
                                            <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
                                            <div className="flex flex-col">
                                                <span className="text-blue-300 uppercase text-[9px]">Time</span>
                                                <span>{formatTime(nextClass.start_time)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Schedule Content */}
                        <div className="lg:col-span-3">
                            {viewMode === 'calendar' ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Days Sidebar/Header */}
                                    <div className="grid grid-cols-6 border-b border-gray-100 bg-gray-50/50">
                                        <div className="p-4 border-r border-gray-100 flex items-center justify-center">
                                            {/* Clock icon removed as requested */}
                                        </div>
                                        {days.map((day, index) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() - date.getDay() + index + 1);
                                            const isToday = date.toDateString() === new Date().toDateString();

                                            return (
                                                <div key={day} className={`p-4 text-center border-l border-gray-100 first:border-l-0 ${isToday ? 'bg-blue-50/30' : ''}`}>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{day.substring(0, 3)}</div>
                                                    <div className={`text-2xl font-bold ${isToday ? 'bg-blue-900 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto' : 'text-gray-700'}`}>
                                                        {date.getDate()}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="relative">
                                        <div className="grid grid-cols-6">
                                            {/* Time Column */}
                                            <div className="border-r border-gray-100 bg-gray-50/30">
                                                {timeSlots.map(time => (
                                                    <div key={time} className="h-20 border-b border-gray-50 px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Grid Columns */}
                                            {days.map(day => (
                                                <div key={day} className="relative border-l border-gray-100 group">
                                                    {timeSlots.map(time => (
                                                        <div key={time} className="h-20 border-b border-gray-50 group-hover:bg-gray-50/50 transition-colors"></div>
                                                    ))}

                                                    {getDayClasses(day).map(slot => {
                                                        const top = getClassPosition(slot.start_time) * 80; // 80px is h-20
                                                        const height = getClassDuration(slot.start_time, slot.end_time) * 80;
                                                        const colorClass = getColorForSubject(slot.subject_details.name);

                                                        return (
                                                            <div
                                                                key={slot.id}
                                                                className={`absolute left-1 right-1 ${colorClass} rounded-lg p-2 border-l-4 shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all cursor-pointer z-10`}
                                                                style={{ top: `${top}px`, height: `${height}px` }}
                                                            >
                                                                <div className="flex flex-col h-full justify-between">
                                                                    <div>
                                                                        <div className="text-[9px] font-bold uppercase tracking-wide opacity-60 mb-1">
                                                                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                                        </div>
                                                                        <div className="text-xs font-semibold leading-tight mb-2">
                                                                            {slot.subject_details.name}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-current border-opacity-10">
                                                                        <div className="text-[10px] font-semibold opacity-80">
                                                                            {slot.classroom_details.room_number}
                                                                        </div>
                                                                        <div className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-black/5">
                                                                            {slot.subject_details.course_name?.split(' ')[0]}
                                                                        </div>
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
                            ) : (
                                <div className="space-y-6">
                                    {days.map(day => {
                                        const classes = getDayClasses(day).sort((a, b) => a.start_time.localeCompare(b.start_time));

                                        return (
                                            <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                                <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-200 flex items-center justify-between">
                                                    <h3 className="text-lg font-bold text-gray-900">{day}</h3>
                                                    <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">{classes.length} Sessions</span>
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {classes.length > 0 ? (
                                                        classes.map(slot => (
                                                            <div key={slot.id} className="p-8 hover:bg-gray-50 transition-all flex items-center gap-8 group">
                                                                <div className="w-24 flex-shrink-0 text-center">
                                                                    <p className="text-2xl font-bold text-blue-900 tracking-tight">{formatTime(slot.start_time)}</p>
                                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mt-1">to {formatTime(slot.end_time)}</p>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{slot.subject_details.name}</h4>
                                                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide group-hover:text-blue-900 transition-colors border border-gray-200 rounded-lg px-2 py-1">
                                                                            {slot.subject_details.course_name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-6 text-sm">
                                                                        <span className="flex items-center gap-2 text-gray-500 font-semibold">
                                                                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m-1 0h7m-5 4v-3" /></svg>
                                                                            Room {slot.classroom_details.room_number}
                                                                        </span>
                                                                        <span className="flex items-center gap-2 text-gray-500 font-semibold uppercase text-[10px] tracking-wide">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                                            Session Confirmed
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg">
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 text-center text-gray-400 font-medium italic">
                                                            No classes scheduled for {day}
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
            </div>
        </div>
    );
};

export default LecturerDashboard;
