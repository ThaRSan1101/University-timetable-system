import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ManageClassrooms = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [panelMode, setPanelMode] = useState('add');
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        room_number: '',
        room_type: 'Lecture Hall', // Default match
        capacity: 30,
        facilities: {
            projector: false,
            whiteboard: true,
            ac: false,
            pc: false
        }
    });

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await api.get('classrooms/');
            // Mocking some extra data for UI match since backend might not have it
            const enhancedData = response.data.map(room => ({
                ...room,
                building: 'Main Campus', // Mock
                status: 'Active', // Mock
                facilities: ['Whiteboard'] // Mock
            }));
            setClassrooms(enhancedData);
        } catch {
            console.error("Failed to fetch classrooms");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateMock = () => {
        // Just for demo if empty
        if (classrooms.length === 0) {
            setClassrooms([
                { id: 1, room_number: 'ENG-101', building: 'Engineering Building, 1st Floor', room_type: 'lecture', capacity: 120, status: 'Active', facilities: ['Projector', 'AC'] },
                { id: 2, room_number: 'SCI-LAB-04', building: 'Science Wing, Basement', room_type: 'lab', capacity: 30, status: 'Maintenance', facilities: ['PC Stations', 'Whiteboard'] },
                { id: 3, room_number: 'LIB-SEM-A', building: 'Library, 2nd Floor', room_type: 'seminar', capacity: 25, status: 'Active', facilities: ['Projector'] },
                { id: 4, room_number: 'ARTS-STD-1', building: 'Arts Center', room_type: 'studio', capacity: 15, status: 'Active', facilities: ['Whiteboard'] },
            ]);
            setLoading(false);
        }
    };

    const handleEditClick = (room) => {
        setPanelMode('edit');
        setSelectedRoomId(room.id);
        setFormData({
            room_number: room.room_number,
            room_type: room.room_type || 'Lecture Hall',
            capacity: room.capacity || 30,
            facilities: {
                projector: room.facilities?.includes('Projector') || false,
                whiteboard: room.facilities?.includes('Whiteboard') || true,
                ac: room.facilities?.includes('AC') || false,
                pc: room.facilities?.includes('PC') || false
            }
        });
        setShowAddPanel(true);
    };

    const handleAddClick = () => {
        setPanelMode('add');
        setSelectedRoomId(null);
        setFormData({
            room_number: '',
            room_type: 'Lecture Hall',
            capacity: 30,
            facilities: { projector: false, whiteboard: true, ac: false, pc: false }
        });
        setShowAddPanel(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                room_number: formData.room_number,
                room_type: formData.room_type.toLowerCase().includes('lab') ? 'lab' : 'lecture',
                capacity: formData.capacity
            };

            if (panelMode === 'edit') {
                await api.put(`classrooms/${selectedRoomId}/`, payload);
            } else {
                await api.post('classrooms/', payload);
            }

            // Reset and refresh
            setFormData({
                room_number: '',
                room_type: 'Lecture Hall',
                capacity: 30,
                facilities: { projector: false, whiteboard: true, ac: false, pc: false }
            });
            setShowAddPanel(false);
            fetchClassrooms();
        } catch {
            alert('Error creating classroom');
        }
    };

    const getBadgeColor = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('lab')) return 'bg-purple-100 text-purple-700';
        if (t.includes('seminar')) return 'bg-orange-100 text-orange-700';
        if (t.includes('studio')) return 'bg-teal-100 text-teal-700';
        return 'bg-blue-100 text-blue-700'; // Lecture default
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <AdminSidebar />

            <div className="flex-1 ml-72 p-8 overflow-y-auto h-screen">
                {/* Header Section */}
                <div className="mb-8">

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Classroom & Lab Management</h1>
                            <p className="text-gray-500 max-w-2xl">
                                Manage university room inventory, track capacities, and schedule maintenance for all educational spaces.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddClick}
                                className="px-4 py-2 bg-blue-900 rounded-lg text-sm font-semibold text-white hover:bg-blue-800 flex items-center gap-2 shadow-md transition-all active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Room
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area: Filter Bar */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
                    <div className="relative w-96">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            type="text"
                            placeholder="Search by room # or building..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none bg-gray-50 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-900 outline-none transition-all">
                            <option>All Types</option>
                            <option>Lecture Hall</option>
                            <option>Laboratory</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-900 outline-none transition-all">
                            <option>Status</option>
                            <option>Active</option>
                            <option>Maintenance</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-6 relative">
                    {/* Table Section */}
                    <div className={`flex-1 transition-all duration-300 ${showAddPanel ? 'w-2/3' : 'w-full'}`}>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-blue-50 border-b border-blue-100">
                                    <tr>
                                        <th className="px-6 py-4 w-12">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Room Info</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Capacity</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classrooms.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No rooms found. <button onClick={handleGenerateMock} className="text-blue-600 font-semibold hover:underline">Generate data</button>
                                            </td>
                                        </tr>
                                    )}
                                    {classrooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900">{room.room_number}</p>
                                                <p className="text-xs text-gray-500">{room.building || 'Main Campus'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${getBadgeColor(room.room_type)}`}>
                                                    {room.room_type || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {room.capacity} Seats
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${room.status === 'Maintenance' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'Maintenance' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                                    {room.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleEditClick(room)} className="text-gray-500 hover:text-blue-900 transition-colors p-1">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                                <span className="text-sm text-gray-500">Showing {classrooms.length} rooms</span>
                                <div className="flex gap-1">
                                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-all">‹</button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-900 text-white font-bold transition-all shadow-sm">1</button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-all">2</button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-all">3</button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-all">›</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Add Room Panel */}
                    {showAddPanel && (
                        <div className="w-96 bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col h-fit sticky top-0 animate-fade-in-right">
                            <div className="p-6 border-b border-blue-100 flex justify-between items-center bg-blue-900 text-white rounded-t-xl">
                                <h3 className="font-bold">{panelMode === 'edit' ? 'Edit Room' : 'Quick Add Room'}</h3>
                                <button onClick={() => setShowAddPanel(false)} className="text-blue-200 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Room ID */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Room Number / ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. ENG-204"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                        value={formData.room_number}
                                        onChange={e => setFormData({ ...formData, room_number: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Must be unique across the campus.</p>
                                </div>

                                {/* Classification */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Room Classification</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                        value={formData.room_type}
                                        onChange={e => setFormData({ ...formData, room_type: e.target.value })}
                                    >
                                        <option>Lecture Hall</option>
                                        <option>Computer Lab</option>
                                        <option>Seminar Room</option>
                                        <option>Design Studio</option>
                                    </select>
                                </div>

                                {/* Max Capacity */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Max Capacity</label>
                                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, capacity: Math.max(0, p.capacity - 1) }))} className="px-4 py-2 hover:bg-gray-100 text-gray-600 border-r border-gray-200">−</button>
                                        <input
                                            type="number"
                                            className="flex-1 text-center bg-transparent border-none outline-none font-semibold text-gray-900"
                                            value={formData.capacity}
                                            onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                        />
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, capacity: p.capacity + 1 }))} className="px-4 py-2 hover:bg-gray-100 text-gray-600 border-l border-gray-200">+</button>
                                    </div>
                                </div>

                                {/* Available Facilities */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Available Facilities</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'projector', label: 'Projector' },
                                            { id: 'whiteboard', label: 'Whiteboard', checked: true },
                                            { id: 'ac', label: 'AC' },
                                            { id: 'pc', label: 'PC Stations' }
                                        ].map(item => (
                                            <label key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    checked={formData.facilities[item.id] || false}
                                                    onChange={e => setFormData(prev => ({
                                                        ...prev,
                                                        facilities: { ...prev.facilities, [item.id]: e.target.checked }
                                                    }))}
                                                />
                                                <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddPanel(false)}
                                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] px-4 py-3 bg-blue-900 rounded-lg text-sm font-bold text-white hover:bg-blue-800 shadow-lg transition-all active:scale-95"
                                    >
                                        {panelMode === 'edit' ? 'Save Changes' : 'Add Room'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageClassrooms;
