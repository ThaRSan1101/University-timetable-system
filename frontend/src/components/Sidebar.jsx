import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import uwuLogo from '../assets/uwu.png';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            name: 'Timetable',
            path: '/student',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: 'Modules',
            path: '/modules',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            name: 'Assessments',
            path: '/assessments',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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
            <div className="pl-2 pr-4 py-8 pb-4 flex items-center gap-3">
                <img src={uwuLogo} alt="UWU Logo" className="w-16 h-16 object-contain" />
                <div>
                    <span className="text-base font-bold tracking-wide whitespace-nowrap">Uva Wellassa University</span>
                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em]">Student Space</p>
                </div>
            </div>

            {/* Navigation Container */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                <h3 className="px-4 text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-4 opacity-50">Main Menu</h3>
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

export default Sidebar;
