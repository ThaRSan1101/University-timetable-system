import { useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage('');
        try {
            const response = await api.post('timetable/generate/');
            if (response.data.status === 'success') {
                setMessage('Timetable generated successfully!');
            } else {
                setMessage(`Generated with conflicts: ${response.data.unscheduled.length} unscheduled items.`);
            }
        } catch {
            setMessage('Error generating timetable.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Timetable Actions</h2>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {generating ? 'Generating...' : 'Generate Timetable'}
                    </button>
                    {message && <p className="mt-4 text-gray-700">{message}</p>}
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Management</h2>
                    <ul className="space-y-2">
                        <li><a href="/admin/lecturers" className="text-blue-600 hover:underline">Manage Lecturers</a></li>
                        <li><a href="/admin/courses" className="text-blue-600 hover:underline">Manage Courses</a></li>
                        <li><a href="/admin/subjects" className="text-blue-600 hover:underline">Manage Subjects</a></li>
                        <li><a href="/admin/classrooms" className="text-blue-600 hover:underline">Manage Classrooms</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
