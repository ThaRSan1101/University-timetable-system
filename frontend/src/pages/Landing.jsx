import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // If already logged in, redirect to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-6">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">University Timetable System</h1>
                <p className="text-xl opacity-90">Manage your schedule efficiently and effortlessly.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
                <Link
                    to="/login"
                    className="flex-1 bg-white text-blue-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1 text-center text-lg"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="flex-1 bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-white/10 transition transform hover:-translate-y-1 text-center text-lg"
                >
                    Register
                </Link>
            </div>

            <footer className="mt-16 text-sm opacity-70">
                &copy; {new Date().getFullYear()} University Timetable System
            </footer>
        </div>
    );
};

export default Landing;
