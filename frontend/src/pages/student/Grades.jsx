import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

const Grades = () => {
    const { user } = useAuth();

    // Mock data for upcoming assignments and quizzes
    const [upcomingWork, setUpcomingWork] = useState([
        {
            id: 1,
            title: "Data Structures Project",
            module: "CS201 - Data Structures",
            type: "Assignment",
            dueDate: "2024-12-28",
            daysLeft: 4,
            status: "Pending"
        },
        {
            id: 2,
            title: "Database Design Quiz",
            module: "CS202 - Database Systems",
            type: "Quiz",
            dueDate: "2024-12-30",
            daysLeft: 6,
            status: "Pending"
        },
        {
            id: 3,
            title: "Algorithm Analysis Report",
            module: "CS203 - Algorithms",
            type: "Assignment",
            dueDate: "2025-01-05",
            daysLeft: 12,
            status: "Pending"
        }
    ]);

    // Mock data for recent grades
    const [recentGrades, setRecentGrades] = useState([
        {
            id: 1,
            title: "Mid-Semester Exam",
            module: "CS201 - Data Structures",
            date: "2024-11-15",
            grade: "A",
            score: 88,
            feedback: "Excellent work on tree traversals."
        },
        {
            id: 2,
            title: "SQL Lab Assessment",
            module: "CS202 - Database Systems",
            date: "2024-11-20",
            grade: "B+",
            score: 78,
            feedback: "Good query optimization, but missed an index."
        },
        {
            id: 3,
            title: "Web Development Project",
            module: "CS204 - Web Technologies",
            date: "2024-12-01",
            grade: "A+",
            score: 95,
            feedback: "Outstanding UI/UX design!"
        }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grades & Assessments</h1>
                        <p className="text-gray-600">Track your academic performance and upcoming deadlines</p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">GPA So Far</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">3.8</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Credits Earned</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">15/18</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase">Upcoming Deadlines</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{upcomingWork.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Upcoming Assignments & Quizzes Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
                                    Upcoming Work
                                </h2>
                                <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingWork.map((item) => (
                                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group relative">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-blue-500 transition-colors rounded-l-xl"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wide ${item.type === 'Quiz' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs font-bold text-orange-600 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {item.daysLeft} DAYS LEFT
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                            {item.module}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                            <div className="text-xs text-gray-400 font-medium">
                                                Due: <span className="text-gray-600">{new Date(item.dueDate).toLocaleDateString()}</span>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Details
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grades;
