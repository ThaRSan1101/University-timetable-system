import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LecturerDashboard = () => {
    const { user } = useAuth();
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                // Assuming user.id is the lecturer's user ID
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

    if (loading) return <div>Loading timetable...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Lecturer Dashboard</h1>
            <div className="bg-white p-6 rounded shadow overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4">My Schedule</h2>
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Day</th>
                            <th className="p-2">Time</th>
                            <th className="p-2">Subject</th>
                            <th className="p-2">Room</th>
                            <th className="p-2">Course</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timetable.map((slot) => (
                            <tr key={slot.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{slot.day}</td>
                                <td className="p-2">{slot.start_time} - {slot.end_time}</td>
                                <td className="p-2">{slot.subject_details.name}</td>
                                <td className="p-2">{slot.classroom_details.room_number}</td>
                                <td className="p-2">{slot.subject_details.course_name}</td>
                            </tr>
                        ))}
                        {timetable.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center">No classes scheduled.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LecturerDashboard;
