import { Link, useLocation } from 'react-router-dom';
import uwuLogo from '../assets/uwu.png';

const AdminSidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            name: 'Dashboard', path: '/admin', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            )
        },
        {
            name: 'Courses', path: '/admin/courses', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            )
        },
        {
            name: 'Lecturers', path: '/admin/lecturers', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )
        },
        {
            name: 'Classrooms', path: '/admin/classrooms', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m-1 0h7m-5 4v-3" /></svg>
            )
        },
        {
            name: 'Subjects', path: '/admin/subjects', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            )
        },
        {
            name: 'Constraints', path: '/admin/constraints', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            )
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <aside className="w-72 bg-gradient-to-b from-blue-900 to-blue-950 text-white fixed left-0 top-0 h-screen flex flex-col z-20 shadow-2xl">
            {/* Logo Section */}
            <div className="pl-2 pr-4 py-8 pb-4 flex items-center gap-3">
                <img src={uwuLogo} alt="UWU Logo" className="w-16 h-16 object-contain" />
                <div>
                    <span className="text-base font-bold tracking-wide whitespace-nowrap">Uva Wellassa University</span>
                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-[0.2em]">Admin Console</p>
                </div>
            </div>

            {/* Navigation Container */}
            <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                <h3 className="px-4 text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-4 opacity-50">Management</h3>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
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

            {/* Bottom Actions */}
            <div className="p-6 mt-auto space-y-2">
                <Link to="/settings" className="flex items-center gap-4 px-4 py-3 rounded-xl text-blue-100/60 hover:bg-white/5 hover:text-white transition-all duration-300 group">
                    <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="font-semibold text-sm">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-red-400/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all duration-300 group shadow-lg shadow-red-900/10"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
                <p className="text-[10px] text-white text-center mt-4 font-medium">
                    © 2025 Admin Dashboard
                </p>
            </div>
        </aside>
    );
};

export default AdminSidebar;
