import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Modules = () => {
    const { user } = useAuth();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState('all');

    useEffect(() => {
        const fetchModules = async () => {
            try {
                // Fetch student profile
                const profileRes = await api.get(`students/?user=${user.id}`);
                if (profileRes.data.length > 0) {
                    const studentProfile = profileRes.data[0];
                    setProfile(studentProfile);

                    // Fetch all subjects for the student's course and year
                    const response = await api.get(`subjects/?course=${studentProfile.course}&year=${studentProfile.year}`);
                    setModules(response.data);
                }
            } catch (error) {
                console.error("Error fetching modules", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchModules();
    }, [user]);

    const groupedModules = modules.reduce((acc, module) => {
        const semester = module.semester || 'Unknown';
        if (!acc[semester]) {
            acc[semester] = [];
        }
        acc[semester].push(module);
        return acc;
    }, {});

    const filteredSemesters = selectedSemester === 'all'
        ? Object.keys(groupedModules).sort()
        : [selectedSemester];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading modules...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Modules</h1>
                        <p className="text-gray-600">
                            Year {profile?.year} • All modules for your course
                        </p>
                    </div>

                    {/* Semester Filter */}
                    <div className="mb-6 flex items-center gap-4">
                        <label className="text-sm font-semibold text-gray-700">Filter by Semester:</label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Semesters</option>
                            {Object.keys(groupedModules).sort().map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>

                    {/* Modules by Semester */}
                    {modules.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Modules Found</h3>
                            <p className="text-gray-500">Modules will appear here once they are assigned to your course.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredSemesters.map(semester => (
                                <div key={semester} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                        <h2 className="text-2xl font-bold text-white">
                                            Semester {semester}
                                        </h2>
                                        <p className="text-blue-100 text-sm mt-1">
                                            {groupedModules[semester].length} {groupedModules[semester].length === 1 ? 'module' : 'modules'}
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {groupedModules[semester].map((module) => (
                                                <div
                                                    key={module.id}
                                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 hover:shadow-md transition-shadow duration-200"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="bg-blue-600 text-white rounded-lg px-3 py-1 text-xs font-semibold">
                                                            {module.code || 'N/A'}
                                                        </div>
                                                        <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                        {module.name}
                                                    </h3>

                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {module.lecturer_name || 'TBA'}
                                                        </div>

                                                        {module.credits && (
                                                            <div className="flex items-center text-gray-600">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {module.credits} Credits
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modules;
