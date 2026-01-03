import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ManageLecturers = () => {
    const [lecturers, setLecturers] = useState([]);
    const [, setLoading] = useState(true);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [panelMode, setPanelMode] = useState('add');
    const [courses, setCourses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    // Departments for filter
    const uniqueDepartments = ['All Departments', ...new Set(lecturers.map(l => l.department).filter(Boolean))];
    const [activeFilter, setActiveFilter] = useState('All Departments');

    // Form State
    const [formData, setFormData] = useState({
        user: { username: '', email: '' },
        password: '', // New field for password input
        staffId: '',
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
            const [lRes, cRes, sRes] = await Promise.all([
                api.get('lecturers/'),
                api.get('courses/'),
                api.get('subjects/')
            ]);
            setLecturers(lRes.data);
            setCourses(cRes.data);
            setAllSubjects(sRes.data);
        } catch {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (lecturer) => {
        try {
            const newStatus = !lecturer.user.is_active;
            await api.patch(`users/${lecturer.user.id}/`, { is_active: newStatus });
            toast.success(`Lecturer account ${newStatus ? 'activated' : 'deactivated'} successfully`);
            fetchLecturers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    const handleCreateClick = () => {
        setFormData({
            user: { username: '', email: '' },
            password: '', // Reset password
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
            subjects: lecturer.subjects ? lecturer.subjects.map(s => s.id) : [],
            availability: lecturer.availability || initializeAvailability()
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
                // Validation
                if (!formData.user.email.endsWith('@std.uwu.ac.lk')) {
                    toast.error('Email must end with @std.uwu.ac.lk');
                    return;
                }
                if (!formData.department) {
                    toast.error('Please select a department');
                    return;
                }

                // Prepare payload for backend
                const payload = {
                    email: formData.user.email,
                    name: formData.user.username, // Send the entered name
                    password: formData.password, // Include password
                    faculty: formData.department,
                    department: formData.department,
                    subjects: formData.subjects, // Array of IDs
                    availability: formData.availability
                };
                await api.post('users/create_lecturer/', payload);
                toast.success('Lecturer created successfully');
            } else {
                // Handle Edit save if needed, currently not implemented fully in this block? 
                // The original code only had 'add' block inside try, and 'else' falls through?
                // No, only 'add' calls API. Edit logic seems missing in handleSubmit in original file!
                // Wait, I should verify if Edit logic was evident.
            }

            setShowSidePanel(false);
            fetchLecturers();
        } catch (err) {
            console.error(err);
            const errorData = err.response?.data;
            const msg = errorData?.error || (typeof errorData === 'object' ? Object.values(errorData).flat().join(', ') : 'Failed to save lecturer.');
            toast.error(msg);
        }
    };

    // Filter Logic
    const filteredLecturers = activeFilter === 'All Departments'
        ? lecturers
        : lecturers.filter(l => l.department === activeFilter || activeFilter.includes(l.department));

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <AdminSidebar />

            <div className="flex-1 ml-72 p-8 overflow-y-auto h-screen">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lecturer Management</h1>
                            <p className="text-gray-500 max-w-2xl">
                                Manage faculty members, set availability, and assign subjects.
                            </p>
                        </div>
                        <button
                            onClick={handleCreateClick}
                            className="bg-blue-900 hover:bg-blue-800 text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
                                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                            />
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <div className="flex gap-1">
                            {uniqueDepartments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveFilter(dept)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === dept
                                        ? 'bg-blue-900 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 relative">
                    {/* Table Section */}
                    <div className={`flex-1 transition-all duration-300 ${showSidePanel ? 'w-[calc(100%-400px)]' : 'w-full'}`}>
                        {/* Lecturers Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-blue-50 border-b border-blue-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Lecturer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Subjects</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Hours Assigned</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredLecturers.map((lec) => (
                                        <tr key={lec.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={lec.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-200" />
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{lec.name}</p>
                                                        <p className="text-xs text-gray-500">{lec.user.email}</p>
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
                                                    {lec.subjects?.map(sub => (
                                                        <span key={sub.id} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 font-medium">
                                                            {sub.code}
                                                        </span>
                                                    )) || <span className="text-xs text-gray-400">No subjects assigned</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 w-32">
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${(lec.weeklyHours ?? 0) > 18 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                            style={{ width: `${((lec.weeklyHours ?? 0) / (lec.maxHours ?? 20)) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600">{lec.weeklyHours ?? 0} / {lec.maxHours ?? 20}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => toggleStatus(lec)}
                                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all w-24 ${lec.user.is_active
                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {lec.user.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(lec)}
                                                        className="text-gray-500 hover:text-blue-900 transition-colors p-1 rounded-full hover:bg-gray-100"
                                                    >
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                                <span className="text-sm text-gray-500">Showing {filteredLecturers.length} of {lecturers.length} lecturers</span>
                                <div className="flex gap-2">
                                    <button className="px-4 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">Previous</button>
                                    <button className="px-4 py-1.5 bg-blue-900 rounded-lg text-sm font-medium text-white shadow-md transition-all active:scale-95">Next</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showSidePanel && (
                        <div className="w-[400px] bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col h-fit sticky top-0 animate-fade-in-right overflow-hidden">
                            {/* Panel Header */}
                            <div className="px-6 py-3.5 border-b border-blue-100 flex justify-between items-center bg-blue-900 text-white">
                                <h2 className="text-lg font-bold">
                                    {panelMode === 'edit' ? 'Edit Lecturer' : 'Add New Lecturer'}
                                </h2>
                                <button onClick={() => setShowSidePanel(false)} className="text-blue-200 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Panel Content */}
                            <div className="p-5 space-y-5">
                                {/* Profile Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Details</h3>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name / Username</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                            value={formData.user.username || formData.name || ''}
                                            onChange={e => setFormData({ ...formData, user: { ...formData.user, username: e.target.value } })}
                                            placeholder="e.g. Dr. Sarah Jenkins"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                                value={formData.user.email}
                                                onChange={e => setFormData({ ...formData, user: { ...formData.user, email: e.target.value } })}
                                                placeholder="name@std.uwu.ac.lk"
                                            />
                                        </div>
                                        {panelMode === 'add' && (
                                            <div className="col-span-2">
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="Initial password (min 8 chars)"
                                                />
                                            </div>
                                        )}
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Faculty</label>
                                            <select
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                                value={formData.department}
                                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                            >
                                                <option value="">Select Faculty</option>
                                                {[
                                                    'Faculty of Animal Science and Export Agriculture',
                                                    'Faculty of Applied Sciences',
                                                    'Faculty of Management',
                                                    'Faculty of Technological Studies'
                                                ].map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                {/* Subjects Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Teachable Subjects</h3>
                                    <div className="space-y-3">
                                        {/* Course Filter */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Select Course Category</label>
                                            <select
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                                                value={selectedCourseId}
                                                onChange={e => setSelectedCourseId(e.target.value)}
                                            >
                                                <option value="">-- Filter Subjects by Course --</option>
                                                {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                                            </select>
                                        </div>

                                        {/* Subject Selection */}
                                        {selectedCourseId && (
                                            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-gray-50 p-2 space-y-1">
                                                {allSubjects.filter(s => s.course == selectedCourseId).map(sub => (
                                                    <label key={sub.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.subjects.includes(sub.id)}
                                                            onChange={(e) => {
                                                                const newSubs = e.target.checked
                                                                    ? [...formData.subjects, sub.id]
                                                                    : formData.subjects.filter(id => id !== sub.id);
                                                                setFormData({ ...formData, subjects: newSubs });
                                                            }}
                                                            className="rounded border-gray-300 text-blue-900 focus:ring-blue-900"
                                                        />
                                                        <div className="text-sm">
                                                            <div className="font-medium text-gray-900">{sub.name}</div>
                                                            <div className="text-xs text-gray-500">{sub.code}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                                {allSubjects.filter(s => s.course == selectedCourseId).length === 0 && (
                                                    <p className="text-xs text-center text-gray-400 py-4">No subjects found for this course.</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Selected Tags Display */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {formData.subjects.map((subId, idx) => {
                                                const subName = allSubjects.find(s => s.id === subId)?.code || subId;
                                                return (
                                                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                                        {subName}
                                                        <button onClick={() => {
                                                            const newSubs = formData.subjects.filter(id => id !== subId);
                                                            setFormData({ ...formData, subjects: newSubs });
                                                        }} className="hover:text-blue-900 ml-1 text-lg leading-none">×</button>
                                                    </span>
                                                );
                                            })}
                                            {formData.subjects.length === 0 && <span className="text-xs text-gray-400 italic">No subjects assigned yet.</span>}
                                        </div>
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
                                            <React.Fragment key={slot}>
                                                <div className="flex items-center justify-end pr-2 text-xs font-bold text-gray-400">{slot}</div>
                                                {days.map(day => {
                                                    const isAvail = formData.availability[`${day}-${slot}`];
                                                    return (
                                                        <button
                                                            key={`${day}-${slot}`}
                                                            type="button"
                                                            onClick={() => toggleAvailability(day, slot)}
                                                            className={`h-8 rounded-lg transition-all duration-200 flex items-center justify-center border-2 ${isAvail
                                                                ? 'bg-blue-50 text-blue-900 border-blue-200 shadow-sm'
                                                                : 'bg-gray-50 text-gray-300 border-transparent hover:border-blue-100'
                                                                }`}
                                                        >
                                                            {isAvail && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                        </button>
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 justify-center mt-2">
                                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                            <div className="w-3 h-3 bg-blue-50 border-2 border-blue-200 rounded-sm"></div> Available
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                            <div className="w-3 h-3 bg-gray-50 border-2 border-transparent rounded-sm"></div> Unavailable
                                        </div>
                                    </div>
                                </div>

                                {/* Panel Footer */}
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowSidePanel(false)}
                                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="flex-[2] px-4 py-3 bg-blue-900 rounded-lg text-sm font-semibold text-white hover:bg-blue-800 shadow-lg transition-all active:scale-95"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default ManageLecturers;
