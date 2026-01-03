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
                const year = user.student_profile?.year;

                if (!courseId) {
                    console.error("Student has no course assigned");
                    setLoading(false);
                    return;
                }

                // Fetch GROUPED subjects from backend
                // Backend filters by course and year (inferred from subject code)
                let url = `subjects/grouped/?course_id=${courseId}`;
                if (year) {
                    url += `&year=${year}`;
                }

                const response = await api.get(url);
                setGroupedData(response.data);
            } catch (error) {
                console.error("Error fetching modules", error);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [user]);

    // Derived state
    const semestersList = groupedData ? groupedData.semesters.map(s => s.semester) : [];
    const totalModules = groupedData ? groupedData.semesters.reduce((acc, curr) => acc + curr.subjects.length, 0) : 0;

    const filteredSemesters = groupedData
        ? (selectedSemester === 'all'
            ? groupedData.semesters
            : groupedData.semesters.filter(s => s.semester === selectedSemester))
        : [];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            <div className="flex-1 overflow-auto ml-72">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading modules...</p>
                        </div>
                    </div>
                ) : !groupedData || !groupedData.semesters.length ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-600">No modules available</p>
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">My Modules</h1>
                            <p className="text-gray-500 mt-1">
                                {totalModules} modules across {semestersList.length} semesters
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
                                {semestersList.map(sem => (
                                    <button
                                        key={sem}
                                        onClick={() => setSelectedSemester(sem)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedSemester === sem
                                            ? 'bg-blue-900 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Semester {sem}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modules by Semester */}
                        <div className="space-y-8">
                            {filteredSemesters.map(semesterGroup => (
                                <div key={semesterGroup.semester} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Semester Header */}
                                    <div className="px-8 py-6 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                                        <h2 className="text-2xl font-bold">Semester {semesterGroup.semester}</h2>
                                        <p className="text-blue-100 mt-1">
                                            {semesterGroup.subjects.length} modules
                                        </p>
                                    </div>

                                    {/* Modules Grid */}
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {semesterGroup.subjects.map(module => (
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
                                                        {module.weekly_hours} Hours
                                                    </span>
                                                </div>

                                                {/* Module Name */}
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {module.name}
                                                </h3>

                                                {/* Lecturer Info */}
                                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                                                        {module.lecturer_name ? module.lecturer_name.charAt(0) : 'T'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900">{module.lecturer_name || 'TBA'}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Lecturer</p>
                                                    </div>
                                                </div>

                                                {/* Course Badge */}
                                                {module.course_name && (
                                                    <div className="mt-2 text-xs text-gray-400">
                                                        {module.course_name}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modules;
