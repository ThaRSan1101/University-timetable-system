import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import register4 from '../assets/register4.jpg';
import { toast } from 'sonner';


const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        course: '',
        year: ''
    });

    const [courses, setCourses] = useState([]);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, loading: authLoading } = useAuth();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

    // Fetch courses for dropdown
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('courses/');
                // Sort by faculty then name
                const sortedCourses = response.data.sort((a, b) => {
                    if (a.faculty < b.faculty) return -1;
                    if (a.faculty > b.faculty) return 1;
                    return a.name.localeCompare(b.name);
                });
                setCourses(sortedCourses);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };
        fetchCourses();
    }, []);

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

    // Frontend validation functions
    const validateEmail = (email, selectedCourseId) => {
        // Relaxed validation: Check domain only
        const pattern = /@std\.uwu\.ac\.lk$/;
        if (!pattern.test(email)) {
            return 'Email must end with @std.uwu.ac.lk';
        }

        return '';
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/\d/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Password must contain at least one special character';
        }
        return '';
    };



    const validateName = (name, fieldName) => {
        if (!name.trim()) {
            return `${fieldName} is required`;
        }
        if (!/^[a-zA-Z\s\-]+$/.test(name)) {
            return `${fieldName} can only contain letters, spaces, and hyphens`;
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
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';

        switch (name) {
            case 'email':
                errorMsg = validateEmail(value, formData.course);
                break;
            case 'password':
                errorMsg = validatePassword(value);
                break;
            case 'first_name':
                errorMsg = validateName(value, 'First name');
                break;
            case 'last_name':
                errorMsg = validateName(value, 'Last name');
                break;
            default:
                break;
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

        // Re-validate email with course
        const emailErr = validateEmail(formData.email, formData.course);
        if (emailErr) newErrors.email = emailErr;

        const pwdErr = validatePassword(formData.password);
        if (pwdErr) newErrors.password = pwdErr;

        // Check password confirmation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Show the first finding error in the main alert
            const firstError = Object.values(newErrors)[0];
            setError(firstError);
            return;
        }

        setLoading(true);
        try {
            // Auto-generate username from email (e.g., cst22076 from cst22076@std.uwu.ac.lk)
            const autoUsername = formData.email.split('@')[0];

            // Register as a student
            await api.post('users/', {
                username: autoUsername,
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                email: formData.email.toLowerCase(),
                password: formData.password,
                role: 'student',
                course: formData.course,
                year: parseInt(formData.year)
            });

            toast.success("Registration successful! Please login with your credentials.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Handle backend validation errors
                const backendErrors = err.response.data;
                const newErrors = {};
                let firstBackendError = '';

                Object.keys(backendErrors).forEach((key, index) => {
                    const errorMessages = Array.isArray(backendErrors[key])
                        ? backendErrors[key].join(', ')
                        : backendErrors[key];
                    newErrors[key] = errorMessages;
                    if (index === 0) firstBackendError = errorMessages;
                });

                setErrors(newErrors);
                // Show the specific backend error in the main alert
                setError(firstBackendError || 'Registration failed. Please try again.');
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

                        {/* Empty top space */}
                        <div className="flex-grow"></div>

                        {/* Bottom Content Wrapper */}
                        <div>
                            {/* Carousel Content */}
                            <div className="mb-8">
                                <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                                    Join UWU Timetable System
                                </h1>
                                <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-md">
                                    Register with your university email to access your personalized timetable and course information.
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
                {/* Right Side - Registration Form */}
                <div className="lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-8 bg-white overflow-y-auto">
                    <div className="w-full max-w-md">
                        {/* Welcome Text */}
                        <div className="mb-4">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Create your account
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Enter your details below to get started.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-xs">{error}</p>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        className={`w-full px-3 py-2.5 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30 text-sm`}
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs mt-0.5">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className={`w-full px-3 py-2.5 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30 text-sm`}
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs mt-0.5">{errors.last_name}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-1">
                                    University Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`w-full px-3 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30 text-sm`}
                                    placeholder="cst22076@std.uwu.ac.lk"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                                {/* <p className="text-xs text-gray-400 mt-0.5">Format: 3 letters + 5 numbers @std.uwu.ac.lk</p> */}
                            </div>

                            {/* Passwords Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`w-full px-3 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30 text-sm`}
                                        placeholder="Min 8 chars"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-0.5">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                                        Confirm <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className={`w-full px-3 py-2.5 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30 text-sm`}
                                        placeholder="Repeat"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            {/* Course & Year */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                                        Course <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="course"
                                        className={`w-full px-3 py-2.5 border ${errors.course ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30 text-sm`}
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {Object.entries(courses.reduce((acc, course) => {
                                            const faculty = course.faculty || 'Other';
                                            if (!acc[faculty]) acc[faculty] = [];
                                            acc[faculty].push(course);
                                            return acc;
                                        }, {})).map(([faculty, facultyCourses]) => (
                                            <optgroup key={faculty} label={faculty}>
                                                {facultyCourses.map(course => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name} ({course.code})
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    {errors.course && <p className="text-red-500 text-xs mt-0.5">{errors.course}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                                        Year <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="year"
                                        className={`w-full px-3 py-2.5 border ${errors.year ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-all bg-gray-50/30 text-sm`}
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="1">Year 1</option>
                                        <option value="2">Year 2</option>
                                        <option value="3">Year 3</option>
                                        <option value="4">Year 4</option>
                                    </select>
                                    {errors.year && <p className="text-red-500 text-xs mt-0.5">{errors.year}</p>}
                                </div>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div className="mt-4 text-center text-gray-600 text-sm">
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
