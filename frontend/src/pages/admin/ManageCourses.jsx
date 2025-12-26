import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '' // Extra field for visual balance
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('courses/');
            // Enhance data for UI
            const enhancedData = response.data.map(course => ({
                ...course,
                totalSubjects: Math.floor(Math.random() * 20) + 10, // Mock stat
                status: 'Active',
                faculty: 'Science' // Mock
            }));
            setCourses(enhancedData);
        } catch {
            console.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend only expects name and code based on previous knowledge
            await api.post('courses/', {
                name: formData.name,
                code: formData.code
            });

            // Reset
            setFormData({ name: '', code: '', description: '' });
            fetchCourses();
        } catch {
            alert('Error creating course');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <AdminSidebar />

            <div className="flex-1 ml-72 p-8 overflow-y-auto h-screen">
                {/* Top Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Degree Program Management</h1>
                        <p className="text-gray-500">Manage university degree programs and their codes.</p>
                    </div>
                </div>

                <div className="flex gap-8 items-start">
                    {/* Left Column: Add Form */}
                    <div className="w-80 flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-blue-100 flex justify-between items-center bg-blue-900 text-white">
                                <h3 className="font-bold">Add New Program</h3>
                                <button className="text-blue-200 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Program Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Computer Science"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Program Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CS"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        placeholder="Brief description of the degree..."
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-all active:scale-95 shadow-md">Save Program</button>
                                    <button type="button" onClick={() => setFormData({ name: '', code: '', description: '' })} className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors">Clear</button>
                                </div>
                            </form>
                        </div>

                        {/* Quick Tip */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Naming Convention</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Use standard 2-4 letter codes for degree programs (e.g., CS, ENG, MAT) to ensure cleaner timetables.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Table */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-gray-900">Existing Programs</h2>
                                <span className="text-gray-400 text-sm">({courses.length} Total)</span>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <input
                                        type="text"
                                        placeholder="Search programs..."
                                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-900 outline-none bg-gray-50 focus:bg-white transition-all"
                                    />
                                </div>
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 focus:ring-2 focus:ring-blue-900 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left">
                                <thead className="bg-blue-50 border-b border-blue-100 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Program Code</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Program Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Faculty</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {courses.length === 0 && !loading && (
                                        <tr><td colSpan="4" className="p-8 text-center text-gray-500">No programs found.</td></tr>
                                    )}
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-bold border border-blue-100">{course.code}</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">{course.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{course.faculty}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">Showing {courses.length} programs</span>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all">Previous</button>
                                <button className="px-4 py-2 bg-blue-900 rounded-lg text-sm font-semibold text-white hover:bg-blue-800 shadow-md transition-all active:scale-95">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
