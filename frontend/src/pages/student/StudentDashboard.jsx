import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

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
        const fetchTimetable = async () => {
            try {
                // Use profile from user context if available, otherwise fetch it
                let studentProfile = user.student_profile;

                if (!studentProfile) {
                    const profileRes = await api.get(`students/?user=${user.id}`);
                    if (profileRes.data.length > 0) {
                        studentProfile = profileRes.data[0];
                    }
                }

                if (studentProfile) {
                    setProfile(studentProfile);
                    const response = await api.get(`timetable/?course_id=${studentProfile.course}&year=${studentProfile.year}&semester=${studentProfile.semester}`);
                    if (response.data && response.data.length > 0) {
                        setTimetable(response.data);
                    } else {
                        setTimetable(dummyTimetable);
                    }
                } else {
                    setTimetable(dummyTimetable);
                }
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
            const minutes = (uH * 60 + uM) - (cH * 60 + cM);
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
        const content = "Timetable Data\n" + timetable.map(t => `${t.day}: ${t.start_time}-${t.end_time} ${t.subject_details.name}`).join("\n");
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'timetable.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your timetable...</p>
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
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium transition-all shadow-md active:scale-95"
                            >
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
                                    <button className="text-blue-900 text-sm font-bold hover:underline">Reset</button>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">SEMESTER</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none">
                                        <option>First Semester</option>
                                        <option>Second Semester</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">VIEW MODE</label>
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

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">FIND MODULE</label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="e.g. CS101"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

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

                        <div className="lg:col-span-3">
                            {viewMode === 'calendar' ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="grid grid-cols-6 border-b border-gray-200">
                                        <div className="p-4 bg-gray-50"></div>
                                        {days.map((day, index) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() - date.getDay() + index + 1);
                                            const isToday = date.toDateString() === new Date().toDateString();

                                            return (
                                                <div key={day} className="p-4 text-center border-l border-gray-200">
                                                    <div className="text-xs text-gray-500 uppercase mb-1">{day.substring(0, 3)}</div>
                                                    <div className={`text-2xl font-bold ${isToday ? 'bg-blue-900 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto' : 'text-gray-900'}`}>
                                                        {date.getDate()}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="relative">
                                        <div className="grid grid-cols-6">
                                            <div className="border-r border-gray-200">
                                                {timeSlots.map(time => (
                                                    <div key={time} className="h-20 border-b border-gray-100 px-3 py-2 text-xs text-gray-500">
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>

                                            {days.map(day => (
                                                <div key={day} className="relative border-l border-gray-200">
                                                    {timeSlots.map(time => (
                                                        <div key={time} className="h-20 border-b border-gray-100"></div>
                                                    ))}

                                                    {getDayClasses(day).map(slot => {
                                                        const top = getClassPosition(slot.start_time) * 80;
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
                            ) : (
                                <div className="space-y-4">
                                    {days.map(day => {
                                        const classes = getDayClasses(day).sort((a, b) => a.start_time.localeCompare(b.start_time));
                                        if (classes.length === 0) return null;

                                        return (
                                            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                                    <h3 className="text-lg font-bold text-gray-900">{day}</h3>
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {classes.map(slot => (
                                                        <div key={slot.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center gap-6">
                                                            <div className="w-24 flex-shrink-0">
                                                                <p className="text-lg font-bold text-blue-900">{slot.start_time}</p>
                                                                <p className="text-sm text-gray-500">to {slot.end_time}</p>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-md font-bold text-gray-900 mb-1">{slot.subject_details.name}</h4>
                                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                    <span className="flex items-center gap-1">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                                        {slot.subject_details.lecturer_name}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m-1 0h7m-5 4v-3" /></svg>
                                                                        Room {slot.classroom_details.room_number}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
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

export default StudentDashboard;
