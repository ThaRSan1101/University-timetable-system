import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LecturerSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock stats
    const stats = {
        totalHours: 14,
        classes: 8,
        students: 245
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 font-sans">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg skew-x-[-10deg]"></div>
                <span className="text-xl font-bold text-gray-900">UniSched Faculty</span>
            </div>

            <div className="px-4 mb-8 mt-6">
                <nav className="space-y-1 mb-8">
                    <a href="/lecturer" className="flex items-center px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 text-gray-600 rounded-lg group transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="font-medium">Timetable</span>
                    </a>
                    <a href="/lecturer/assessments" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg group transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        <span className="font-medium">Assessments</span>
                    </a>
                    <a href="/profile" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg group transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="font-medium">Profile</span>
                    </a>
                </nav>

                <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Weekly Overview</h3>

                <div className="mb-4 px-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Total Hours</span>
                        <span className="font-bold text-gray-900">{stats.totalHours} hrs</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-3/4 rounded-full"></div>
                    </div>
                </div>

                <div className="mb-4 px-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Classes</span>
                        <span className="font-bold text-gray-900">{stats.classes} sessions</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-1/2 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-auto mb-6">
                <button className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={handleLogout}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default LecturerSidebar;
