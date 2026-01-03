import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const StudentAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchAssessments();
    }, []);

    const getDaysLeft = (dueDate) => {
        const diff = new Date(dueDate) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const stats = {
        completed: assessments.filter(a => a.status === 'Completed').length,
        cancelled: assessments.filter(a => a.status === 'Cancelled').length,
        upcoming: assessments.filter(a => a.status === 'Active' && new Date(a.due_date) >= new Date()).length
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Quiz': return 'bg-purple-50 text-purple-700';
            case 'Assignment': return 'bg-blue-50 text-blue-700';
            case 'Mid Exam': return 'bg-orange-50 text-orange-700';
            case 'Final Exam': return 'bg-red-50 text-red-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your assessments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar />

            <div className="flex-1 ml-72 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessments</h1>
                        <p className="text-gray-600">Track your academic assessments and upcoming deadlines</p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Completed</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Cancelled</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.cancelled}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Upcoming</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.upcoming}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Assessments Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-blue-900 rounded-full"></span>
                                    All Assessments
                                </h2>
                            </div>

                            {assessments.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">No assessments found for your course year.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {assessments.map((item) => {
                                        const daysLeft = getDaysLeft(item.due_date);
                                        const isLate = daysLeft < 0;

                                        return (
                                            <div key={item.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group relative flex flex-col ${item.status === 'Cancelled' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                                                <div className={`absolute top-0 left-0 w-1 h-full transition-colors rounded-l-xl ${item.status === 'Cancelled' ? 'bg-red-300' : 'bg-transparent group-hover:bg-blue-500'
                                                    }`}></div>

                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wide ${getTypeColor(item.assessment_type)}`}>
                                                        {item.assessment_type}
                                                    </span>
                                                    {item.status !== 'Cancelled' && (
                                                        <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded ${isLate ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                                            }`}>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {isLate ? 'OVERDUE' : `${daysLeft} DAYS LEFT`}
                                                        </span>
                                                    )}
                                                    {item.status === 'Cancelled' && (
                                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Cancelled</span>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2" title={item.title}>
                                                    {item.title}
                                                </h3>

                                                <p className="text-sm text-gray-500 mb-auto font-medium flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                    {item.subject_details?.code} - {item.subject_details?.name}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                                                    <div className="text-xs text-gray-400 font-medium">
                                                        Due: <span className={`font-semibold ${isLate ? 'text-red-600' : 'text-gray-600'}`}>
                                                            {item.due_date}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-medium ml-auto">
                                                        {item.subject_details?.lecturer_name}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAssessments;
