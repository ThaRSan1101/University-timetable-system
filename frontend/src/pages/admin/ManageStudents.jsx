
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All Departments');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('students/');
            setStudents(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (student) => {
        try {
            const newStatus = !student.user.is_active;
            await api.patch(`users/${student.user.id}/`, { is_active: newStatus });
            toast.success(`Student account ${newStatus ? 'activated' : 'deactivated'} successfully`);
            await fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    // Filter Logic
    const uniqueDepartments = ['All Departments', ...new Set(students.map(s => s.department).filter(Boolean))];
    const filteredStudents = activeFilter === 'All Departments'
        ? students
        : students.filter(s => s.department === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <AdminSidebar />
            <div className="flex-1 ml-72 p-8 overflow-y-auto h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
                    <p className="text-gray-500">Manage student accounts and academic status.</p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 pl-2">
                        {/* Search Input */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input
                                type="text"
                                placeholder="Search by name, ID..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                            />
                        </div>
                        <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        <div className="flex gap-1 overflow-x-auto">
                            {uniqueDepartments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveFilter(dept)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === dept
                                        ? 'bg-blue-900 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {dept || 'Unknown'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-blue-50 border-b border-blue-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Subjects</th>
                                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.length > 0 ? filteredStudents.map((stu) => (
                                <tr key={stu.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{stu.name}</p>
                                            <p className="text-xs text-gray-500">{stu.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold">
                                            {stu.department || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700 font-medium">{stu.course_code || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">Year {stu.year} Sem {stu.semester}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap w-48">
                                            {stu.subjects && stu.subjects.length > 0 ? stu.subjects.map(sub => (
                                                <span key={sub} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600 font-medium">
                                                    {sub}
                                                </span>
                                            )) : <span className="text-xs text-gray-400">No subjects</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleStatus(stu)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all w-24 ${stu.user.is_active
                                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                                }`}
                                        >
                                            {stu.user.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                        <span className="text-sm text-gray-500">Showing {filteredStudents.length} of {students.length} students</span>
                        <div className="flex gap-2">
                            <button className="px-4 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-600 hover:bg-gray-50">Previous</button>
                            <button className="px-4 py-1.5 bg-blue-900 rounded-lg text-sm font-medium text-white shadow-md">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageStudents;
