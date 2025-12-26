import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import register4 from '../assets/register4.jpg';
import uwuLogo from '../assets/uwu.png';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            title: 'Join Our Community',
            description: 'Create your account to access personalized timetables, academic resources, and stay connected with your university.'
        },
        {
            title: 'Easy Registration',
            description: 'Quick and secure account setup. Get started in minutes and access all university scheduling features.'
        },
        {
            title: 'Stay Organized',
            description: 'Never miss a class or exam. Get real-time updates and manage your academic schedule efficiently.'
        }
    ];

    const images = [
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            // Register as a student
            await api.post('users/', {
                username: formData.email,
                email: formData.email,
                password: formData.password,
                role: 'student'
            });

            // Optional: Auto-login or redirect to login
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Try to show specific error messages
                const messages = Object.values(err.response.data).flat().join(', ');
                setError(messages || 'Registration failed');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Full Screen Container */}
            <div className="w-full min-h-screen flex flex-col lg:flex-row">
                {/* Left Side - Image and Carousel */}
                <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-900 to-blue-950 min-h-[300px] lg:min-h-screen">
                    {/* Background Images with Sliding Effect */}
                    <div className="absolute inset-0">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`University ${index + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-90' : 'opacity-0'
                                    }`}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col p-8 lg:p-16 text-white h-full">
                        {/* Empty top space */}
                        <div className="flex-grow"></div>

                        {/* Bottom Content Wrapper */}
                        <div>
                            {/* Carousel Content */}
                            <div className="mb-8">
                                <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Master your semester planning.
                                </h1>
                                <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-md">
                                    Join students, lecturers, and admins in the most efficient university timetable generation system.
                                </p>
                            </div>

                            {/* Footer */}
                            <p className="text-sm text-blue-200/60">
                                © {new Date().getFullYear()} UniSchedule System. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
                    <div className="w-full max-w-md">
                        {/* Welcome Text */}
                        <div className="mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                Create your account
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Enter your details below to get started.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    University Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30"
                                        placeholder="e.g. name@university.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30"
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30"
                                        placeholder="Repeat password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-8 text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-900 hover:text-blue-800 font-bold gap-1 inline-flex">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
