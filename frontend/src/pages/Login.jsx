import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

import register4 from '../assets/register4.jpg';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            redirectBasedOnRole(user.role);
        }
    }, [user, loading, navigate]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    // Role-based redirection
    const redirectBasedOnRole = (role) => {
        switch (role) {
            case 'admin':
                navigate('/admin-dashboard');
                break;
            case 'lecturer':
                navigate('/lecturer-dashboard');
                break;
            case 'student':
                navigate('/dashboard');
                break;
            default:
                navigate('/dashboard');
        }
    };

    // Frontend validation
    const validateEmail = (email) => {
        if (!email.trim()) {
            return 'Email is required';
        }
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (error) {
            setError('');
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';

        if (name === 'email') {
            errorMsg = validateEmail(value);
        } else if (name === 'password') {
            errorMsg = validatePassword(value);
        }

        if (errorMsg) {
            setErrors(prev => ({ ...prev, [name]: errorMsg }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});

        // Validate all fields
        const newErrors = {};

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setError('Please fix the errors above');
            return;
        }

        setIsSubmitting(true);
        try {
            // Sanitize email before sending
            const sanitizedEmail = formData.email.trim().toLowerCase();

            // Login returns user data with role
            const response = await login(sanitizedEmail, formData.password);

            // Get user role from response or context
            // The backend returns role in the response
            // We'll redirect based on the user object that gets set in context

        } catch (err) {
            console.error('Login error:', err);
            console.log('Error response:', err.response?.data); // Debug log

            // Handle different error types
            if (err.response) {
                // Backend returned an error
                console.log('Backend error:', err.response.data);

                if (err.response.status === 401) {
                    setError('Invalid email or password. Please try again.');
                } else if (err.response.data?.detail) {
                    setError(err.response.data.detail);
                } else if (err.response.data?.non_field_errors) {
                    setError(err.response.data.non_field_errors[0]);
                } else {
                    // Show the actual error from backend
                    const errorMsg = JSON.stringify(err.response.data);
                    setError(`Login failed: ${errorMsg}`);
                }
            } else if (err.request) {
                // Network error
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Watch for user changes after login to redirect
    useEffect(() => {
        if (user && !loading) {
            redirectBasedOnRole(user.role);
        }
    }, [user, loading]);

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
                        {/* Back to Home Button */}
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors group mb-auto"
                        >
                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Home
                        </Link>

                        {/* Empty top space - removed flex-grow since we used mb-auto on the link to push content down, or keep it if needed */}
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

                {/* Right Side - Login Form */}
                <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
                    <div className="w-full max-w-md">
                        {/* Back to Home Button */}


                        {/* Welcome Text */}
                        <div className="mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600 text-lg">
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
                        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="nope">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        className={`w-full pl-12 pr-4 py-4 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30`}
                                        placeholder="e.g. name@university.edu"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                        autoComplete="nope"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Password
                                    </label>
                                    <a href="#forgot" className="text-sm text-blue-900 hover:text-blue-800 font-bold">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`w-full pl-12 pr-4 py-4 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            } rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30`}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                        autoComplete="nope"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-8 text-center text-gray-600">
                            New to the university?{' '}
                            <Link to="/register" className="text-blue-900 hover:text-blue-800 font-bold inline-flex gap-1">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
