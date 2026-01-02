import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ManageModules = () => {
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]); // These are Degree Programs (e.g. CS)
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        course: '',
        lecturer: '',
        year: 2024,
        semester: 'Fall',
        hours: 3,
        priority: 'Medium'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subRes, courseRes] = await Promise.all([
                api.get('subjects/'),
                api.get('courses/')
            ]);

            setModules(subRes.data);
            setCourses(courseRes.data);
        } catch {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Map UI fields to Backend
            const payload = {
                name: formData.name,
                code: formData.code,
                course: formData.course,
                lecturer: formData.lecturer,
                year: formData.year,
                semester: formData.semester === 'Fall' ? 1 : 2,
                weekly_hours: formData.hours,
                priority: formData.priority
            };

            await api.post('subjects/', payload);

            // Reset
            setFormData({
                name: '',
                code: '',
                course: '',
                lecturer: '',
                year: 2024,
                semester: 'Fall',
                hours: 3,
                priority: 'Medium'
            });
            fetchData();
        } catch {
            alert('Error creating module');
        }
    };

    const getBadgeStyle = (deptName) => {
        const d = (deptName || '').toLowerCase();
        if (d.includes('comp')) return 'bg-blue-100 text-blue-700';
        if (d.includes('eng')) return 'bg-orange-100 text-orange-700';
        if (d.includes('math')) return 'bg-purple-100 text-purple-700';
        if (d.includes('art')) return 'bg-pink-100 text-pink-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <AdminSidebar />

            <div className="flex-1 ml-72 p-8 overflow-y-auto h-screen">
                {/* Top Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Course & Module Management</h1>
                        <p className="text-gray-500">Add, update, and organize university course inventory.</p>
                    </div>
                    <div className="flex gap-3">
                    </div>
                </div>

                <div className="flex gap-8 items-start">
                    {/* Left Column: Add Form */}
                    <div className="w-80 flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-blue-100 flex justify-between items-center bg-blue-900 text-white">
                                <h3 className="font-bold">Add New Module</h3>
                                <button className="text-blue-200 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Module Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Intro to Computer Science"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Module Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CS101"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Course</label>
                                        <select
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none bg-white transition-all"
                                            value={formData.course}
                                            onChange={e => setFormData({ ...formData, course: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Lecturer</label>
                                        <select
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none bg-white transition-all"
                                            value={formData.lecturer}
                                            onChange={e => setFormData({ ...formData, lecturer: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Lecturer</option>
                                            <option value="1">Dr. Jenkins</option>
                                            <option value="2">Dr. Smith</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Year</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Semester</label>
                                        <select
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none bg-white transition-all"
                                            value={formData.semester}
                                            onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                        >
                                            <option value="Fall">Fall</option>
                                            <option value="Spring">Spring</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Weekly Hours</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                                            value={formData.hours}
                                            onChange={e => setFormData({ ...formData, hours: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                                        <select
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none bg-white transition-all"
                                            value={formData.priority}
                                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-2 flex gap-3">
                                    <button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-md active:scale-95">Save Module</button>
                                    <button type="button" className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-sm transition-all" onClick={() => setFormData({ name: '', code: '', course: '', lecturer: '', year: 2024, semester: 'Fall', hours: 3, priority: 'Medium' })}>Clear</button>
                                </div>
                            </form>
                        </div>

                        {/* Quick Tip */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">Quick Tip</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Ensure subject codes are unique across all departments. You can view all existing codes in the table on the right.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Table */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-gray-900">Existing Modules</h2>
                                <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full text-xs">({modules.length} Total)</span>
                            </div>
                            <div className="flex gap-3">
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    <input
                                        type="text"
                                        placeholder="Search by name or code..."
                                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left">
                                <thead className="bg-blue-50 border-b border-blue-100 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Module Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Lecturer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-center">Year</th>
                                        <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Semester</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {modules.length === 0 && !loading && (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">No modules found. Add one!</td></tr>
                                    )}
                                    {modules.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">{sub.code}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 text-sm">{sub.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-700">{sub.lecturer_name || 'TBA'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${getBadgeStyle(sub.course_name)}`}>
                                                    {sub.course_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-600 font-bold">
                                                {sub.year}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-medium text-gray-600 block">{sub.semester === 1 ? 'Fall' : 'Spring'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageModules;
