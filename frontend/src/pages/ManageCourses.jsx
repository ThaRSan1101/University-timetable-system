import { useState, useEffect } from 'react';
import api from '../services/api';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ name: '', code: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('courses/');
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('courses/', formData);
            setFormData({ name: '', code: '' });
            fetchCourses();
        } catch (error) {
            alert('Error creating course');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Course Name (e.g. Computer Science)"
                        className="border p-2 rounded flex-1"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Course Code (e.g. CS)"
                        className="border p-2 rounded w-32"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-blue-700">Add</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Existing Courses</h2>
                {loading ? <p>Loading...</p> : (
                    <ul className="space-y-2">
                        {courses.map((course) => (
                            <li key={course.id} className="border-b p-2 flex justify-between">
                                <span>{course.name}</span>
                                <span className="font-mono bg-gray-100 px-2 rounded">{course.code}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;
