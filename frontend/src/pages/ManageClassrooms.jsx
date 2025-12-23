import { useState, useEffect } from 'react';
import api from '../services/api';

const ManageClassrooms = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [formData, setFormData] = useState({ room_number: '', room_type: 'lecture', capacity: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await api.get('classrooms/');
            setClassrooms(response.data);
        } catch {
            console.error("Failed to fetch classrooms");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('classrooms/', formData);
            setFormData({ room_number: '', room_type: 'lecture', capacity: '' });
            fetchClassrooms();
        } catch {
            alert('Error creating classroom');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Classrooms</h1>

            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Classroom</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Room Number"
                        className="border p-2 rounded"
                        value={formData.room_number}
                        onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                        required
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.room_type}
                        onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
                    >
                        <option value="lecture">Lecture Hall</option>
                        <option value="lab">Laboratory</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Capacity"
                        className="border p-2 rounded"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-primary text-white p-2 rounded hover:bg-blue-700">Add</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Existing Classrooms</h2>
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Room Number</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classrooms.map((room) => (
                                <tr key={room.id} className="border-b">
                                    <td className="p-2">{room.room_number}</td>
                                    <td className="p-2 capitalize">{room.room_type}</td>
                                    <td className="p-2">{room.capacity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageClassrooms;
