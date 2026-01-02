import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

/**
 * Modules - Pure Display Component
 * 
 * NO GROUPING LOGIC - Backend does all grouping by semester
 */
const Modules = () => {
    const { user } = useAuth();
    const [groupedData, setGroupedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSemester, setSelectedSemester] = useState('all');

    useEffect(() => {
        const fetchModules = async () => {
            if (!user) return;

            try {
                const courseId = user.student_profile?.course;

                if (!courseId) {
                    console.error("Student has no course assigned");
                    setLoading(false);
                    return;
                }

                // Fetch GROUPED subjects from backend
                // Backend does ALL grouping and sorting
                const response = await api.get(`subjects/grouped/?course_id=${courseId}`);
                setGroupedData(response.data);
            } catch (error) {
                console.error("Error fetching modules", error);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading modules...</p>
                </div>
            </div>
        );
    }

    if (!groupedData || !groupedData.semesters.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-600">No modules available</p>
                </div>
            </div>
        );
    }

    // Filter semesters for display (frontend filtering for UI only, not data processing)
    const displaySemesters = selectedSemester === 'all'
        ? groupedData.semesters
        : groupedData.semesters.filter(s => s === selectedSemester);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="flex-1 overflow-auto ml-72">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Modules</h1>
                        <p className="text-gray-500 mt-1">
                            {groupedData.total_subjects} modules across {groupedData.semesters.length} semesters
                        </p>
                    </div>

                    {/* Semester Filter */}
                    <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Filter by Semester</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedSemester('all')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSemester === 'all'
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Semesters
                            </button>
                            {groupedData.semesters.map(semester => (
                                <button
                                    key={semester}
                                    onClick={() => setSelectedSemester(semester)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSemester === semester
                                            ? 'bg-blue-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {semester}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Modules by Semester */}
                    <div className="space-y-8">
                        {displaySemesters.map(semester => (
                            <div key={semester} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Semester Header */}
                                <div className="px-8 py-6 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                                    <h2 className="text-2xl font-bold">{semester}</h2>
                                    <p className="text-blue-100 mt-1">
                                        {groupedData.grouped_modules[semester].length} modules
                                    </p>
                                </div>

                                {/* Modules Grid */}
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupedData.grouped_modules[semester].map(module => (
                                        <div
                                            key={module.id}
                                            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                                        >
                                            {/* Module Code Badge */}
                                            <div className="flex items-start justify-between mb-4">
                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-900 text-xs font-bold rounded-full">
                                                    {module.code}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {module.display.credits} Credits
                                                </span>
                                            </div>

                                            {/* Module Name */}
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                                                {module.name}
                                            </h3>

                                            {/* Module Details */}
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>{module.lecturer.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{module.weekly_hours} hours/week</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <span>Year {module.year}</span>
                                                </div>
                                            </div>

                                            {/* Course Badge */}
                                            {module.course.name && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {module.course.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modules;
