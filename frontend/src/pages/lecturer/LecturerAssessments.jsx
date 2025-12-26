import { useState } from 'react';
import LecturerSidebar from '../../components/LecturerSidebar';

const LecturerAssessments = () => {
    const [assessments, setAssessments] = useState([
        { id: 1, title: 'Data Structures Project', type: 'Assignment', module: 'CS201', dueDate: '2024-12-28', status: 'Active', description: 'Complete all data structure implementations.' },
        { id: 2, title: 'Database Quiz 1', type: 'Quiz', module: 'CS202', dueDate: '2024-12-30', status: 'Scheduled', description: 'Covers normalization and SQL basics.' },
    ]);

    const [showPanel, setShowPanel] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Assignment',
        module: '',
        dueDate: '',
        description: ''
    });

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({ title: '', type: 'Assignment', module: '', dueDate: '', description: '' });
        setShowPanel(true);
    };

    const handleOpenEdit = (assessment) => {
        setEditingId(assessment.id);
        setFormData({
            title: assessment.title,
            type: assessment.type,
            module: assessment.module,
            dueDate: assessment.dueDate,
            description: assessment.description || ''
        });
        setShowPanel(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // Update existing
            setAssessments(assessments.map(a =>
                a.id === editingId ? { ...a, ...formData } : a
            ));
        } else {
            // Create new
            const assessment = {
                id: assessments.length + 1,
                ...formData,
                status: 'Active'
            };
            setAssessments([...assessments, assessment]);
        }
        setShowPanel(false);
        setFormData({ title: '', type: 'Assignment', module: '', dueDate: '', description: '' });
    };

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to cancel this assessment?')) {
            setAssessments(assessments.map(a =>
                a.id === id ? { ...a, status: 'Canceled' } : a
            ));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
            <LecturerSidebar />

            <div className="flex-1 ml-72 flex h-screen overflow-hidden">
                {/* Main Content List Area */}
                <div className={`flex-1 overflow-auto p-8 ${showPanel ? 'pr-4' : ''}`}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Assessments & Quizzes</h1>
                            <p className="text-gray-500 mt-1">Manage coursework and evaluations for your students</p>
                        </div>
                        {!showPanel && (
                            <button
                                onClick={handleOpenCreate}
                                className="bg-blue-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md active:scale-95 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create New
                            </button>
                        )}
                    </div>

                    {/* Assessments List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                            <h2 className="font-semibold text-gray-800">All Assessments</h2>
                            <div className="flex gap-2">
                                <select className="text-sm border-gray-200 rounded-lg focus:ring-blue-900 focus:border-transparent p-2 outline-none border">
                                    <option>All Modules</option>
                                    <option>CS201</option>
                                    <option>CS202</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Module</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Due Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {assessments.map((assessment) => (
                                        <tr key={assessment.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 text-gray-900 font-medium">{assessment.title}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-medium uppercase">
                                                    {assessment.module}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase ${assessment.type === 'Quiz' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {assessment.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{assessment.dueDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase ${assessment.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                        assessment.status === 'Canceled' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {assessment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleOpenEdit(assessment)}
                                                    className="text-blue-900 hover:text-black mr-4 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(assessment.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Side Create/Edit Panel */}
                <div
                    className={`bg-white border-l border-gray-200 shadow-2xl h-screen flex flex-col ${showPanel ? 'w-[400px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-xl font-bold text-blue-900 uppercase">
                            {editingId ? 'Edit Assessment' : 'New Assessment'}
                        </h3>
                        <button
                            onClick={() => setShowPanel(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all font-sans"
                                placeholder="e.g., Midterm Project"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Module</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all font-sans"
                                    placeholder="e.g., CS201"
                                    value={formData.module}
                                    onChange={e => setFormData({ ...formData, module: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Type</label>
                                <select
                                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all font-sans"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Assignment">Assignment</option>
                                    <option value="Quiz">Quiz</option>
                                    <option value="Exam">Exam</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Due Date</label>
                            <input
                                type="date"
                                required
                                className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all font-sans"
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Description</label>
                            <textarea
                                className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all h-32 font-sans"
                                placeholder="Instructions for students..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full py-4 text-sm font-semibold uppercase text-white bg-blue-900 rounded-xl hover:bg-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                {editingId ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Update Assessment
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Assessment
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LecturerAssessments;
