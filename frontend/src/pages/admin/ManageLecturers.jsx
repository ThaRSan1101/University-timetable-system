import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ManageLecturers = () => {
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [panelMode, setPanelMode] = useState('add'); // 'add' or 'edit'

    // Departments for filter
    const departments = ['All Departments', 'Computer Science', 'Mathematics', 'Engineering', 'Business'];
    const [activeFilter, setActiveFilter] = useState('All Departments');

    // Form State
    const [formData, setFormData] = useState({
        user: { username: '', email: '' },
        staffId: '',
        department: '',
        faculty: '',
        subjects: [],
        availability: {} // Map of day+time -> boolean
    });

    // Mock Availability Grid Data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const timeSlots = ['AM', 'Noon', 'PM'];

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const response = await api.get('lecturers/');
            // Enhance data with mocks for UI
            const enhancedData = response.data.map((lec, index) => ({
                ...lec,
                name: lec.user.username || 'Unknown',
                staffId: `LEC-2024-${100 + index}`,
                avatar: `https://ui-avatars.com/api/?name=${lec.user.username}&background=random`,
                subjects: index % 2 === 0 ? ['CS101', 'CS202'] : ['MAT101'],
                weeklyHours: 12 + (index * 2),
                maxHours: 20
            }));
            setLecturers(enhancedData);
        } catch {
            console.error("Failed to fetch lecturers");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setFormData({
            user: { username: '', email: '' },
            staffId: '',
            department: '',
            faculty: '',
            subjects: [],
            availability: initializeAvailability()
        });
        setPanelMode('add');
        setShowSidePanel(true);
    };

    const handleEditClick = (lecturer) => {
        setFormData({
            ...lecturer,
            user: lecturer.user,
            staffId: lecturer.staffId,
            department: lecturer.department,
            subjects: lecturer.subjects,
            availability: initializeAvailability() // Mock load
        });
        setPanelMode('edit');
        setShowSidePanel(true);
    };

    const initializeAvailability = () => {
        const avail = {};
        days.forEach(d => {
            timeSlots.forEach(t => {
                avail[`${d}-${t}`] = true; // Default available
            });
        });
        return avail;
    };

    const toggleAvailability = (day, slot) => {
        const key = `${day}-${slot}`;
        setFormData(prev => ({
            ...prev,
            availability: {
                ...prev.availability,
                [key]: !prev.availability[key]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (panelMode === 'add') {
                // Prepare payload for backend
                const payload = {
                    email: formData.user.email,
                    faculty: formData.department, // Mapping dept to faculty for now based on backend logic
                    department: formData.department
                };
                await api.post('users/create_lecturer/', payload);
            }

            setShowSidePanel(false);
            fetchLecturers();
        } catch {
            alert('Error saving lecturer. Email might be in use.');
        }
    };

    // Filter Logic
    const filteredLecturers = activeFilter === 'All Departments'
        ? lecturers
        : lecturers.filter(l => l.department === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <AdminSidebar />

            <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                {/* Header */}
                <div className="mb-8">
                    <nav className="flex text-sm text-gray-500 mb-2">
                        <span>Dashboard</span>
                        <span className="mx-2">›</span>
                        <span className="text-gray-900 font-medium">Lecturers</span>
                    </nav>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lecturer Management</h1>
                            <p className="text-gray-500 max-w-2xl">
                                Manage faculty members, set availability, and assign subjects.
                            </p>
                        </div>
                        <button
                            onClick={handleCreateClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Add Lecturer
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 pl-2">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Search by name, ID..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <div className="flex gap-1">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveFilter(dept)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === dept
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {dept === 'Computer Science' ? 'Comp. Sci.' : dept}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lecturers Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lecturer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subjects</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hours Assigned</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLecturers.map((lec) => (
                                <tr key={lec.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => handleEditClick(lec)}>
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={lec.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-200" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{lec.name}</p>
                                                <p className="text-xs text-gray-500">ID: {lec.staffId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700`}>
                                            {lec.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {lec.subjects.map(sub => (
                                                <span key={sub} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 font-medium">
                                                    {sub}
                                                </span>
                                            ))}
                                            <span className="text-xs text-gray-400 mt-0.5">+2 more</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 w-32">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${lec.weeklyHours > 18 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                    style={{ width: `${(lec.weeklyHours / lec.maxHours) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-600">{lec.weeklyHours} / {lec.maxHours}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Showing {filteredLecturers.length} of 24 lecturers</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm text-gray-600 hover:bg-gray-50">Previous</button>
                            <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm text-gray-600 hover:bg-gray-50">Next</button>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                {showSidePanel && (
                    <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col">
                        {/* Panel Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {panelMode === 'edit' ? 'Edit Lecturer' : 'Add New Lecturer'}
                            </h2>
                            <button onClick={() => setShowSidePanel(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200">
                            <div className="space-y-6">
                                {/* Profile Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Details</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name / Username</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={formData.user.username || formData.name || ''}
                                            onChange={e => setFormData({ ...formData, user: { ...formData.user, username: e.target.value } })}
                                            placeholder="e.g. Dr. Sarah Jenkins"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={formData.user.email}
                                                onChange={e => setFormData({ ...formData, user: { ...formData.user, email: e.target.value } })}
                                                placeholder="email@uni.edu"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                                            <select
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={formData.department}
                                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                            >
                                                <option value="">Select Dept</option>
                                                {departments.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Subjects Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Teachable Subjects</h3>
                                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 min-h-[46px] flex flex-wrap gap-2 items-center">
                                        {formData.subjects && formData.subjects.map((sub, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                                {sub}
                                                <button onClick={() => {
                                                    const newSubs = [...formData.subjects];
                                                    newSubs.splice(idx, 1);
                                                    setFormData({ ...formData, subjects: newSubs });
                                                }} className="hover:text-blue-900">×</button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            placeholder="+ Tag"
                                            className="bg-transparent border-none outline-none text-sm min-w-[60px] flex-1"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.target.value.trim();
                                                    if (val) setFormData({ ...formData, subjects: [...(formData.subjects || []), val] });
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Availability Section */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weekly Availability</h3>
                                        <span className="text-xs text-gray-400">Click to toggle</span>
                                    </div>

                                    <div className="grid grid-cols-6 gap-2 text-center text-xs font-medium text-gray-500">
                                        <div></div>
                                        {days.map(d => <div key={d}>{d}</div>)}

                                        {timeSlots.map(slot => (
                                            <>
                                                <div key={slot} className="flex items-center justify-end pr-2 text-xs font-bold text-gray-400">{slot}</div>
                                                {days.map(day => {
                                                    const isAvail = formData.availability[`${day}-${slot}`];
                                                    return (
                                                        <button
                                                            key={`${day}-${slot}`}
                                                            onClick={() => toggleAvailability(day, slot)}
                                                            className={`h-10 rounded-lg transition-all duration-200 flex items-center justify-center ${isAvail
                                                                    ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                                                    : 'bg-gray-50 text-gray-300 border border-transparent'
                                                                }`}
                                                        >
                                                            {isAvail && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                        </button>
                                                    );
                                                })}
                                            </>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 justify-center mt-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div> Available
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <div className="w-3 h-3 bg-gray-50 rounded"></div> Unavailable
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowSidePanel(false)}
                                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 px-4 py-3 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLecturers;
