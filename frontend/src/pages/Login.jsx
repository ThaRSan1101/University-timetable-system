import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import uwuLogo from '../assets/uwu.png';
import login3 from '../assets/login3.jpg';
import register4 from '../assets/register4.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const slides = [
        {
            title: 'Timetable Scheduler',
            description: 'Access your personalized semester schedule, exam dates, and academic resources all in one place.'
        },
        {
            title: 'Smart Scheduling',
            description: 'Intelligent conflict-free timetable generation for all faculties and departments.'
        },
        {
            title: 'Real-time Updates',
            description: 'Get instant notifications about schedule changes and important announcements.'
        }
    ];

    const images = [
        login3,
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=1200&fit=crop',
        register4
    ];

    // Auto-slide images every 3 seconds
    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(imageInterval);
    }, [images.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Centered Card Container */}
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                {/* Left Side - Image and Carousel */}
                <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-900 to-blue-950 min-h-[300px] lg:min-h-[600px]">
                    {/* Background Images with Sliding Effect */}
                    <div className="absolute inset-0">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`University ${index + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-90' : 'opacity-0'
                                    }`}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>



                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 text-white h-full">
                        {/* Logo/Icon removed */}
                        <div></div>

                        {/* Carousel Content */}
                        <div className="mb-8">
                            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                                Master your semester planning.
                            </h1>
                            <p className="text-base lg:text-lg text-blue-100 leading-relaxed max-w-md">
                                Join students, lecturers, and admins in the most efficient university timetable generation system.
                            </p>


                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Welcome Text */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600">
                                Please sign in to manage your semester timetable.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    University ID / Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 transition"
                                        placeholder="e.g. name@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Password
                                    </label>
                                    <a href="#forgot" className="text-sm text-blue-900 hover:text-blue-800 font-medium">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 transition"
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3.5 rounded-lg transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Log In
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            New to the university?{' '}
                            <Link to="/register" className="text-blue-900 hover:text-blue-800 font-semibold inline-flex gap-1">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Outside the card */}
            <div className="absolute bottom-4 left-0 right-0">
                <p className="text-xs text-gray-500 text-center">
                    © {new Date().getFullYear()} UniSchedule System. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
