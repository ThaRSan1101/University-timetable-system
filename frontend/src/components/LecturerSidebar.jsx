import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import uwuLogo from '../assets/uwu.png';

const LecturerSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            name: 'Timetable',
            path: '/lecturer',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: 'Assessments',
            path: '/lecturer/assessments',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    return (
        <aside className="w-72 bg-gradient-to-b from-blue-900 to-blue-950 text-white fixed left-0 top-0 h-screen flex flex-col z-20 shadow-2xl">
            {/* Logo Section */}
            <div className="p-8 pb-4 flex items-center gap-3">
                <img src={uwuLogo} alt="UWU Logo" className="w-16 h-16 object-contain" />
                <div>
                    <span className="text-xl font-extrabold tracking-tight">UWU Sched</span>
                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em]">Faculty Space</p>
                </div>
            </div>

            {/* Navigation Container */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                <h3 className="px-4 text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-4 opacity-50">Faculty Menu</h3>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive(item.path)
                            ? 'bg-white/10 text-white shadow-inner border-l-4 border-yellow-500'
                            : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className={`transition-colors duration-300 ${isActive(item.path) ? 'text-yellow-500' : 'group-hover:text-yellow-500'}`}>
                            {item.icon}
                        </div>
                        <span className="font-semibold text-sm">{item.name}</span>
                    </Link>
                ))}

                <div className="pt-8 px-4">
                    <h3 className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-6 opacity-50">Weekly Overview</h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-blue-300/60">Total Hours</span>
                                <span className="text-white">{stats.totalHours} hrs</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                <span className="text-blue-300/60">Classes</span>
                                <span className="text-white">{stats.classes} sessions</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Logout Action */}
            <div className="p-6 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all duration-300 group shadow-lg shadow-red-900/10"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
                <p className="text-[10px] text-white text-center mt-6 font-medium">
                    © 2025 UniSchedule System
                </p>
            </div>
        </aside>
    );
};

export default LecturerSidebar;
