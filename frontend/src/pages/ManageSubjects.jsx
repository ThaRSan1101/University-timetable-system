import { useState, useEffect } from 'react';
import api from '../services/api';

const ManageSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        course: '',
        year: 1,
        semester: 1,
        weekly_hours: 3,
        priority: 1,
        lecturer: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subRes, courseRes, lecRes] = await Promise.all([
                api.get('subjects/'),
                api.get('courses/'),
                api.get('lecturers/') // Need to get user ID from this
            ]);
            setSubjects(subRes.data);
            setCourses(courseRes.data);
            setLecturers(lecRes.data);
        } catch {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('subjects/', formData);
            // Reset form but keep some defaults
            setFormData(prev => ({ ...prev, name: '', code: '' }));
            fetchData();
        } catch {
            alert('Error creating subject');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Subjects</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Subject</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text" placeholder="Subject Name" className="border p-2 rounded"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                    />
                    <input
                        type="text" placeholder="Subject Code" className="border p-2 rounded"
                        value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} required
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select
                        className="border p-2 rounded"
                        value={formData.lecturer} onChange={e => setFormData({ ...formData, lecturer: e.target.value })}
                    >
                        <option value="">Select Lecturer</option>
                        {lecturers.map(l => <option key={l.id} value={l.user.id}>{l.user.username}</option>)}
                    </select>

                    <div className="flex items-center gap-2">
                        <label>Year:</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <label>Sem:</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <label>Hours:</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.weekly_hours} onChange={e => setFormData({ ...formData, weekly_hours: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <label>Priority:</label>
                        <input type="number" className="border p-2 rounded w-full" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} />
                    </div>

                    <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-blue-700 col-span-full">Add Subject</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow overflow-x-auto">
                <h2 className="text-lg font-semibold mb-4">Existing Subjects</h2>
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Name</th>
                                <th className="p-2">Code</th>
                                <th className="p-2">Course</th>
                                <th className="p-2">Y/S</th>
                                <th className="p-2">Lecturer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((sub) => (
                                <tr key={sub.id} className="border-b">
                                    <td className="p-2">{sub.name}</td>
                                    <td className="p-2">{sub.code}</td>
                                    <td className="p-2">{sub.course_name}</td>
                                    <td className="p-2">Y{sub.year}/S{sub.semester}</td>
                                    <td className="p-2">{sub.lecturer_name || 'Unassigned'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageSubjects;
