import { useState, useEffect } from 'react';
import api from '../services/api';

const ManageLecturers = () => {
    const [lecturers, setLecturers] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        faculty: '',
        department: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const response = await api.get('lecturers/');
            setLecturers(response.data);
        } catch (error) {
            console.error("Failed to fetch lecturers");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // We use the custom action created in UserViewSet to create lecturer + user
            await api.post('users/create_lecturer/', formData);
            setMessage('Lecturer created successfully! Password sent to email.');
            setFormData({ email: '', faculty: '', department: '' });
            fetchLecturers();
        } catch (error) {
            setMessage('Error creating lecturer. Email might be taken.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Lecturers</h1>

            {/* Create Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Lecturer</h2>
                {message && <p className={`mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Faculty"
                        className="border p-2 rounded"
                        value={formData.faculty}
                        onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Department"
                        className="border p-2 rounded"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-blue-700">Add Lecturer</button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Existing Lecturers</h2>
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Name/Email</th>
                                <th className="p-2">Faculty</th>
                                <th className="p-2">Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lecturers.map((lec) => (
                                <tr key={lec.id} className="border-b">
                                    <td className="p-2">{lec.user.email}</td>
                                    <td className="p-2">{lec.faculty}</td>
                                    <td className="p-2">{lec.department}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageLecturers;
