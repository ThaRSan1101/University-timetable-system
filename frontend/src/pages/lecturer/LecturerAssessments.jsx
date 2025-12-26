import { useState } from 'react';
import LecturerSidebar from '../../components/LecturerSidebar';

const LecturerAssessments = () => {
    const [assessments, setAssessments] = useState([
        { id: 1, title: 'Data Structures Project', type: 'Assignment', module: 'CS201', dueDate: '2024-12-28', status: 'Active' },
        { id: 2, title: 'Database Quiz 1', type: 'Quiz', module: 'CS202', dueDate: '2024-12-30', status: 'Scheduled' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newAssessment, setNewAssessment] = useState({
        title: '',
        type: 'Assignment',
        module: '',
        dueDate: '',
        description: ''
    });

    const handleCreate = (e) => {
        e.preventDefault();
        const assessment = {
            id: assessments.length + 1,
            ...newAssessment,
            status: 'Active'
        };
        setAssessments([...assessments, assessment]);
        setShowModal(false);
        setNewAssessment({ title: '', type: 'Assignment', module: '', dueDate: '', description: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <LecturerSidebar />

            <div className="flex-1 ml-72 overflow-auto">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Assessments & Quizzes</h1>
                            <p className="text-gray-500 mt-1">Manage coursework and evaluations for your students</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Active Assessments</div>
                            <div className="text-3xl font-bold text-gray-900 mt-2">{assessments.filter(a => a.status === 'Active').length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Upcoming Deadlines</div>
                            <div className="text-3xl font-bold text-blue-600 mt-2">2</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Submissions</div>
                            <div className="text-3xl font-bold text-green-600 mt-2">145</div>
                        </div>
                    </div>

                    {/* Assessments List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-800">All Assessments</h2>
                            <div className="flex gap-2">
                                <select className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                    <option>All Modules</option>
                                    <option>CS201</option>
                                    <option>CS202</option>
                                </select>
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Module</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assessments.map((assessment) => (
                                    <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{assessment.title}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                                {assessment.module}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assessment.type === 'Quiz' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {assessment.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">{assessment.dueDate}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assessment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {assessment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</button>
                                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Create New Assessment</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                    placeholder="e.g., Midterm Project"
                                    value={newAssessment.title}
                                    onChange={e => setNewAssessment({ ...newAssessment, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Module Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                        placeholder="e.g., CS201"
                                        value={newAssessment.module}
                                        onChange={e => setNewAssessment({ ...newAssessment, module: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                        value={newAssessment.type}
                                        onChange={e => setNewAssessment({ ...newAssessment, type: e.target.value })}
                                    >
                                        <option value="Assignment">Assignment</option>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Exam">Exam</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                    value={newAssessment.dueDate}
                                    onChange={e => setNewAssessment({ ...newAssessment, dueDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                                    rows="3"
                                    placeholder="Instructions for students..."
                                    value={newAssessment.description}
                                    onChange={e => setNewAssessment({ ...newAssessment, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 from-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                                >
                                    Create Assessment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LecturerAssessments;
