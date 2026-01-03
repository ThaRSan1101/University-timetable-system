import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import uwuLogo from '../assets/uwu.png';
import studentsImg from '../assets/students.jpg';
import lecturerImg from '../assets/lecturer.jpg';
import uwuHero from '../assets/uwu_hero.jpg';
import register2 from '../assets/regiter2.jpg';

const Landing = () => {
    const { loading: authLoading, user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;



    return (

        <div className="min-h-screen bg-gray-50 font-sans scroll-smooth">
            {/* Header - Transparent Glass Theme */}
            <header className="bg-white/70 backdrop-blur-md text-gray-900 shadow-sm sticky top-0 z-50">
                <nav className="w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex-1">
                        <Link to="/" className="flex items-center gap-0">
                            <img src={uwuLogo} alt="UWU Logo" className="w-20 h-20 object-contain" />
                            <span className="text-3xl font-serif font-semibold tracking-wide text-blue-900 leading-none mt-1 -ml-2">UWU</span>
                        </Link>
                    </div>

                    {/* Navigation Links - Centered */}
                    <div className="hidden md:flex items-center justify-center gap-8 flex-none">
                        <a href="#about" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">About</a>
                        <a href="#features" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">Features</a>
                        <a href="#mission" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">Our Mission</a>
                    </div>

                    {/* Auth Buttons Section */}
                    <div className="flex-1 hidden md:flex items-center justify-end gap-3">
                        <Link
                            to="/register"
                            className="text-blue-900 hover:bg-blue-50 text-base font-semibold px-6 py-2.5 rounded-lg transition"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="bg-blue-900 hover:bg-blue-800 text-white text-base font-semibold px-8 py-2.5 rounded-lg transition shadow-sm"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">

                        <Link to="/login" className="block text-blue-900 font-bold">Portal Login</Link>
                    </div>
                )}
            </header>

            {/* Hero Section - Reduced Height & Blue Theme */}
            <section className="relative w-full h-[500px] lg:h-[600px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={uwuHero}
                        alt="Uva Wellassa University"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Gradient Overlay - Blue Theme */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/70 to-transparent"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="max-w-2xl text-white pt-4">


                        <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-tight mb-6 text-white drop-shadow-md">
                            Precision Scheduling for Academic Excellence.
                        </h1>

                        <p className="text-xl text-blue-50 mb-10 leading-relaxed font-light max-w-xl">
                            UWU streamlines university timetables, resource management, and real-time updates—all in one centralized official platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/login"
                                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 text-lg font-bold px-8 py-3 rounded-full transition shadow-lg flex items-center justify-center gap-2"
                            >
                                Login to Dashboard
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>



            {/* Why Use Section */}
            <section id="about" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Why use the Scheduling System
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Designed specifically for Uva Wellassa University, integrating academic structure, simplifying the complexity of modern timetabling.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Generation</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Intelligent algorithms instantly create schedules, slot time expertise for every group, class, and room expertise for lectures, labs, and exams, no manual scheduling or mishaps, no conflicts.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition">
                            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Resource Optimization</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Maximize the usage of lecture halls and laboratories, the system prevents double-booking and suggests the best venue for each session.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time updates</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Last-minute changes? No problem. Instant notifications ensure lecturers and students are always aware of revised timetables, no confusion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission Section - Flipped Layout */}
            <section id="mission" className="relative overflow-hidden">
                <div className="flex flex-col lg:flex-row min-h-[550px]">
                    {/* Left Panel: Theme Light Blue (Compact) */}
                    <div className="lg:w-[45%] bg-blue-50/40 p-12 lg:pl-20 lg:pr-20 flex flex-col justify-center relative">
                        <div className="flex flex-col gap-6 max-w-xl">
                            {/* Card 1 */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-6 hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Academic Quality</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Optimizing lecture distribution to ensure students maintain a healthy learning pace and faculty output.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2 (Featured Yellow) */}
                            <div className="bg-yellow-400 p-6 rounded-2xl shadow-xl flex items-center gap-6 transform hover:scale-[1.01] transition-transform">
                                <div className="w-14 h-14 shrink-0 rounded-xl bg-white/20 flex items-center justify-center text-slate-900">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-950 mb-1">Resource Efficiency</h4>
                                    <p className="text-sm text-slate-900/80 leading-relaxed font-medium">
                                        Intelligent mapping of university facilities for maximum capacity and resource utilization.
                                    </p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-6 hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 019-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Unified Coordination</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Bringing administrative decision-making, lecturer availability, and student needs together.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: University Blue (Dominant) with Background Image */}
                    <div className="lg:w-[55%] p-12 lg:pl-24 lg:pr-20 flex flex-col justify-center relative overflow-hidden">
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 bg-cover z-0"
                            style={{ backgroundImage: `url(${register2})`, backgroundPosition: 'center 35%' }}
                        >
                            <div className="absolute inset-0 bg-blue-900/90 backdrop-blur-[2px]"></div>
                        </div>


                        <div className="relative z-10 lg:text-left">
                            <span className="text-blue-300 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Our Commitment</span>
                            <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-none">
                                <span className="text-white">Our </span>
                                <span className="text-yellow-400 italic">Mission</span>
                            </h2>

                            <div className="flex justify-start">
                                <p className="text-blue-50/80 text-lg leading-relaxed mb-6 max-w-md">
                                    To empower Uva Wellassa University with a cutting-edge scheduling ecosystem, fostering academic excellence through intelligent resource management and seamless coordination.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tailored for Everyone Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Tailored for Everyone
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            A unified platform serving the entire university ecosystem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* For Students */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={studentsImg}
                                    alt="Students"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="bg-white p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">For Students</h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Access your personal timetable anytime, anywhere. Filter by course, view weekly schedules, and never miss a lecture.
                                </p>
                            </div>
                        </div>

                        {/* For Lecturers */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={lecturerImg}
                                    alt="Lecturer"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="bg-white p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">For Lecturers</h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Manage your teaching load, request classroom changes, view student attendance, and plan your semester with confidence.
                                </p>
                            </div>
                        </div>

                        {/* For Admins */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
                                    alt="Admin"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="bg-white p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">For Admins</h3>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Centralize control, create schedules, resolve conflicts, manage resources, and oversee the entire timetabling process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-blue-900 to-blue-950 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Ready to access your schedule?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Log in with your UWU credentials to access the personalized dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-blue-950 font-bold px-8 py-3.5 rounded-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white text-gray-700 py-12 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">
                        {/* Left Side: Brand, Desc, Socials */}
                        <div className="max-w-sm">
                            <Link to="/" className="flex items-center gap-0 mb-4">
                                <img src={uwuLogo} alt="UWU Logo" className="w-20 h-20 object-contain" />
                                <span className="text-2xl font-semibold text-gray-900 -ml-2">UWU</span>
                            </Link>
                            <p className="text-sm text-gray-600 mb-6">
                                The Uva Wellassa System is an innovative timetabling solution designed to enhance technology and student experience.
                            </p>

                            <div className="flex gap-3">
                                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-900 hover:text-white text-gray-700 rounded-full flex items-center justify-center transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-900 hover:text-white text-gray-700 rounded-full flex items-center justify-center transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-900 hover:text-white text-gray-700 rounded-full flex items-center justify-center transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Links & Contact */}
                        <div className="flex gap-16 lg:gap-24">
                            {/* Extra Links */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li><a href="#" className="hover:text-blue-900 transition">About Us</a></li>
                                    <li><a href="#" className="hover:text-blue-900 transition">Faculties</a></li>
                                    <li><a href="#" className="hover:text-blue-900 transition">Library</a></li>
                                    <li><a href="#" className="hover:text-blue-900 transition">Alumni</a></li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li>Badulla Road,</li>
                                    <li>Badulla, 90000</li>
                                    <li><a href="mailto:info@uwu.ac.lk" className="hover:text-blue-900 transition">info@uwu.ac.lk</a></li>
                                    <li><a href="tel:+94552226622" className="hover:text-blue-900 transition">+94 55 222 6622</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex justify-between items-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} UWU. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
