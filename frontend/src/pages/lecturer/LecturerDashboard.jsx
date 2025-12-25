import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LecturerSidebar from '../../components/LecturerSidebar';

const LecturerDashboard = () => {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const response = await api.get(`timetable/?lecturer_id=${user.id}`);
                setTimetable(response.data);
            } catch (error) {
                console.error("Error fetching timetable", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchTimetable();
    }, [user]);

    // Helper to format time
    const formatTime = (time) => {
        return time ? time.slice(0, 5) : '';
    };

    // Helper to get day name and date for the current week
    const getWeekDays = () => {
        const curr = new Date();
        const first = curr.getDate() - curr.getDay() + 1; // First day is Monday
        const days = [];
        for (let i = 0; i < 5; i++) {
            let next = new Date(curr.getTime());
            next.setDate(first + i);
            days.push({
                name: next.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                date: next.getDate(),
                fullDate: next,
                isToday: next.toDateString() === new Date().toDateString()
            });
        }
        return days;
    };

    const weekDays = getWeekDays();
    const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

    // Function to position events on the grid
    const getEventStyle = (day, startTime, duration) => {
        const startHour = parseInt(startTime.split(':')[0]);
        const top = (startHour - 8) * 60 + 20; // 20px offset for padding
        const height = duration * 60;

        // Find column index (0-4 for Mon-Fri)
        const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].indexOf(day);

        return {
            top: `${top}px`,
            height: `${height}px`,
            left: `${dayIndex * 20}%`, // Approximate width based on 5 columns
            width: '19%' // Leaving gap
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <LecturerSidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="text-blue-600 font-semibold">Academic Year 2024-2025</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-blue-600 font-semibold">Semester 1</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Print Schedule
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{user?.username || "Dr. Sarah Jenkins"}</p>
                                <p className="text-xs text-gray-500">Computer Science Dept.</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sub Header & Controls */}
                <div className="px-8 py-6 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Department of Computer Science</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                                <button className="p-1 px-3 hover:bg-gray-100 rounded-md text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <span className="px-4 font-semibold text-gray-700">Today</span>
                                <button className="p-1 px-3 hover:bg-gray-100 rounded-md text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">October 14 - 20, 2024</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-1 rounded-lg flex">
                            <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-sm font-semibold text-gray-800">Week</button>
                            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800">Day</button>
                            <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800">Month</button>
                        </div>
                        <button className="flex items-center gap-2 text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filter
                        </button>
                    </div>
                </div>

                {/* Timetable Grid */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    <div className="min-w-[800px] h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        {/* Days Header */}
                        <div className="flex border-b border-gray-200">
                            <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-gray-50"></div>
                            <div className="flex-1 grid grid-cols-5">
                                {weekDays.map((day, idx) => (
                                    <div key={idx} className={`py-4 text-center border-r border-gray-100 last:border-r-0 ${day.isToday ? 'bg-blue-50/30' : ''}`}>
                                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">{day.name}</div>
                                        <div className={`text-2xl font-bold ${day.isToday ? 'text-blue-600' : 'text-gray-800'}`}>{day.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Schedule Grid */}
                        <div className="flex-1 overflow-auto relative flex">
                            {/* Time Slots Column */}
                            <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-gray-50 text-xs text-gray-400 font-medium text-center py-4 space-y-[44px]">
                                {timeSlots.map(hour => (
                                    <div key={hour} className="h-4">{hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}</div>
                                ))}
                            </div>

                            {/* Main Grid Mesh (Background Lines) */}
                            <div className="flex-1 relative bg-white">
                                {timeSlots.map((_, i) => (
                                    <div key={i} className="absolute w-full border-b border-gray-100" style={{ top: `${i * 60 + 20}px` }}></div>
                                ))}
                                <div className="absolute inset-0 grid grid-cols-5 h-full pointer-events-none">
                                    {[0, 1, 2, 3, 4].map(col => (
                                        <div key={col} className="border-r border-gray-100 h-full"></div>
                                    ))}
                                </div>

                                {/* Current Time Indicator Mock */}
                                <div className="absolute left-0 w-full flex items-center pointer-events-none z-20" style={{ top: '340px' }}>
                                    <div className="w-full border-t border-red-400"></div>
                                    <div className="absolute -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>

                                {/* Events */}
                                {timetable.map((slot) => {
                                    // Calculate styles based on day/time
                                    const style = getEventStyle(slot.day, slot.start_time, 2); // Assuming 2 hours for now logic needs improvement
                                    return (
                                        <div
                                            key={slot.id}
                                            className="absolute p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                                            style={{
                                                ...style,
                                                backgroundColor: slot.classroom_details.room_number.includes('Lab') ? '#1e293b' : '#3b82f6', // Dark for Labs, Blue for Lectures
                                                borderColor: slot.classroom_details.room_number.includes('Lab') ? '#0f172a' : '#2563eb',
                                                color: 'white'
                                            }}
                                        >
                                            <div>
                                                <div className="inline-block px-2 py-0.5 rounded bg-white/20 text-xs font-semibold mb-2">
                                                    {slot.classroom_details.room_number.includes('Lab') ? 'Lab' : 'Lecture'}
                                                </div>
                                                <h3 className="font-bold text-sm leading-tight mb-1">{slot.subject_details.name}</h3>
                                                <p className="text-xs opacity-90">{slot.subject_details.course_name} • {slot.classroom_details.room_number}</p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Mock Events to match image */}
                                <div className="absolute p-3 rounded-lg border-l-4 shadow-sm bg-blue-100/50 border-blue-200 text-blue-800"
                                    style={{ top: '380px', height: '100px', left: '41%', width: '19%' }}
                                >
                                    <h3 className="font-bold text-sm mb-1">Thesis Supervision</h3>
                                    <p className="text-xs text-blue-600">Individual Meetings</p>
                                </div>

                                <div className="absolute p-3 rounded-lg border-2 border-red-200 bg-white shadow-sm"
                                    style={{ top: '680px', height: '100px', left: '41%', width: '19%' }}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-sm text-red-500 mb-1">Department Meeting</h3>
                                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                    </div>
                                    <p className="text-xs text-gray-500">Conf Room B</p>
                                </div>

                                <div className="absolute p-3 rounded-lg bg-gray-100/80 border-l-4 border-gray-300"
                                    style={{ top: '800px', height: '100px', left: '21%', width: '19%' }}
                                >
                                    <h3 className="font-bold text-sm text-gray-800 mb-1">Office Hours</h3>
                                    <p className="text-xs text-gray-500">Room 304</p>
                                </div>

                                {/* A Dark Lab Block Mock */}
                                <div className="absolute p-3 rounded-lg border-l-4 shadow-md text-white bg-slate-800 border-slate-900"
                                    style={{ top: '320px', height: '220px', left: '21%', width: '19%' }}
                                >
                                    <div className="inline-block px-2 py-0.5 rounded bg-green-900/50 text-green-400 text-xs font-semibold mb-2">
                                        Lab
                                    </div>
                                    <h3 className="font-bold text-sm leading-tight mb-1">Advanced Algorithms</h3>
                                    <p className="text-xs text-slate-400">CS305 • Lab 4</p>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                        Cohort B
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LecturerDashboard;
