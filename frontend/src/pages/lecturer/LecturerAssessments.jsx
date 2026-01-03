import { useState, useEffect } from 'react';
import LecturerSidebar from '../../components/LecturerSidebar';
import api from '../../services/api';
import { toast } from 'sonner';

const LecturerAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showPanel, setShowPanel] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        assessment_type: 'Assignment',
        subject: '',
        due_date: '',
        description: ''
    });

    // Fetch initial data
    useEffect(() => {
        fetchAssessments();
        fetchSubjects();
    }, []);

    const fetchAssessments = async () => {
        try {
            const response = await api.get('assessments/');
            setAssessments(response.data);
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await api.get('assessments/my_subjects/');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({
            title: '',
            assessment_type: 'Assignment',
            subject: '',
            due_date: '',
            description: ''
        });
        setShowPanel(true);
    };

    const handleOpenEdit = (assessment) => {
        setEditingId(assessment.id);
        setFormData({
            title: assessment.title,
            assessment_type: assessment.assessment_type,
            subject: assessment.subject,
            due_date: assessment.due_date,
            description: assessment.description || ''
        });
        setShowPanel(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing
                await api.put(`assessments/${editingId}/`, formData);
                toast.success('Assessment updated successfully');
            } else {
                // Create new
                await api.post('assessments/', formData);
                toast.success('Assessment created successfully');
            }
            fetchAssessments();
            setShowPanel(false);
            setFormData({ title: '', assessment_type: 'Assignment', subject: '', due_date: '', description: '' });
        } catch (error) {
            console.error('Error saving assessment:', error);
            toast.error('Failed to save assessment. Please try again.');
        }
    };

    const handleCancel = (id) => {
        toast('Cancel Assessment?', {
            description: 'Are you sure you want to cancel this assessment? This action cannot be undone.',
            action: {
                label: 'Yes, cancel it',
                onClick: () => confirmCancel(id),
            },
            cancel: {
                label: 'No, keep it',
                onClick: () => { },
            },
            duration: Infinity,
            className: 'bg-white', // Ensure visibility if theme is dark/light mixed
        });
    };

    const confirmCancel = async (id) => {
        try {
            await api.patch(`assessments/${id}/`, { status: 'Cancelled' });
            toast.success('Assessment cancelled successfully');
            fetchAssessments();
        } catch (error) {
            console.error('Error cancelling assessment:', error);
            toast.error('Failed to cancel assessment');
        }
    };

    // Find selected subject details for display
    const selectedSubject = subjects.find(s => s.id === parseInt(formData.subject));

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
                                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md active:scale-95 transition-all"
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
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.code} - {subject.name}</option>
                                    ))}
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
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading assessments...</td>
                                        </tr>
                                    ) : assessments.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No assessments found. Create one to get started.</td>
                                        </tr>
                                    ) : (
                                        assessments.map((assessment) => (
                                            <tr
                                                key={assessment.id}
                                                className={`hover:bg-blue-50/30 transition-colors group ${assessment.status === 'Cancelled' ? 'opacity-50 bg-gray-50' : ''}`}
                                            >
                                                <td className="px-6 py-4 text-gray-900 font-medium">
                                                    {assessment.title}
                                                    {assessment.status === 'Cancelled' && <span className="ml-2 text-xs text-red-500 font-bold">(Cancelled)</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-medium uppercase">
                                                        {assessment.subject_details?.code || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase ${assessment.assessment_type === 'Quiz' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {assessment.assessment_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-sm">{assessment.due_date}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleOpenEdit(assessment)}
                                                        className="text-blue-900 hover:text-blue-700 mr-4 text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    {assessment.status !== 'Cancelled' && (
                                                        <button
                                                            onClick={() => handleCancel(assessment.id)}
                                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Side Create/Edit Panel */}
                <div
                    className={`bg-white border-l border-gray-200 shadow-2xl h-screen flex flex-col transition-all duration-300 ${showPanel ? 'w-[400px] opacity-100' : 'w-0 opacity-0 overflow-hidden'
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

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Module</label>
                                <select
                                    required
                                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all font-sans"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="">Select Module</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.code} - {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {selectedSubject && (
                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs space-y-1 text-blue-800">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Course:</span>
                                            <span>{selectedSubject.course_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Year:</span>
                                            <span>Year {selectedSubject.year}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Semester:</span>
                                            <span>Semester {selectedSubject.semester}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Type</label>
                                <select
                                    className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all font-sans"
                                    value={formData.assessment_type}
                                    onChange={e => setFormData({ ...formData, assessment_type: e.target.value })}
                                >
                                    <option value="Assignment">Assignment</option>
                                    <option value="Quiz">Quiz</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Project">Project</option>
                                    <option value="Presentation">Presentation</option>
                                    <option value="Lab Report">Lab Report</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase mb-2">Due Date</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent p-3 border outline-none text-gray-800 transition-all font-sans"
                                value={formData.due_date}
                                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
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
                                className="w-full py-4 text-sm font-semibold uppercase text-white bg-blue-900 rounded-xl hover:bg-blue-800 shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
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
