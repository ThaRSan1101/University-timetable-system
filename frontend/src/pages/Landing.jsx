import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Landing = () => {
    const { user, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    // If already logged in, redirect to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-950 rounded flex items-center justify-center text-white font-bold text-xl">
                                U
                            </div>
                            <span className="text-lg font-semibold text-gray-900">UWU Timetable System</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#home" className="text-gray-700 hover:text-blue-900 transition">Home</a>
                            <a href="#faculties" className="text-gray-700 hover:text-blue-900 transition">Faculties</a>
                            <a href="#help" className="text-gray-700 hover:text-blue-900 transition">Help Desk</a>
                        </div>

                        {/* Portal Login Button */}
                        <div className="hidden md:block">
                            <Link
                                to="/login"
                                className="bg-yellow-500 hover:bg-yellow-600 text-blue-950 font-bold px-6 py-2.5 rounded-md transition shadow-sm"
                            >
                                Portal Login
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t pt-4">
                            <div className="flex flex-col gap-4">
                                <a href="#home" className="text-gray-700 hover:text-blue-900 transition">Home</a>
                                <a href="#faculties" className="text-gray-700 hover:text-blue-900 transition">Faculties</a>
                                <a href="#help" className="text-gray-700 hover:text-blue-900 transition">Help Desk</a>
                                <Link
                                    to="/login"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-blue-950 font-bold px-6 py-2.5 rounded-md transition text-center"
                                >
                                    Portal Login
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-full text-sm mb-6">
                            <span className="w-2 h-2 bg-blue-900 rounded-full"></span>
                            <span className="font-medium">Official University Platform</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Intelligent Scheduling for{' '}
                            <span className="text-blue-900">Uva Wellassa University</span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Seamlessly generate conflict-free timetables, manage lecture hall resources, and access real-time schedule updates—all in one centralized portal.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <Link
                                to="/login"
                                className="bg-blue-900 hover:bg-blue-950 text-white font-semibold px-8 py-3.5 rounded-lg transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                            >
                                Login to Dashboard
                            </Link>
                            <Link
                                to="/register"
                                className="bg-yellow-500 hover:bg-yellow-600 text-blue-950 font-semibold px-8 py-3.5 rounded-lg transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                            >
                                Public Timetables
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">A</div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">L</div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-800 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">S</div>
                            </div>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">Trusted by 5,000+</span> students & staff
                            </p>
                        </div>
                    </div>

                    {/* Right Content - University Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop"
                                alt="Uva Wellassa University Building"
                                className="w-full h-[400px] lg:h-[500px] object-cover"
                            />

                            {/* Live Update Card */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 text-sm mb-1">LIVE UPDATE</h4>
                                        <p className="text-xs text-gray-600">
                                            Yesterday 2 final schedules are now available for viewing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-12 border-y">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
                            <div className="text-sm text-gray-600">Faculties</div>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">50+</div>
                            <div className="text-sm text-gray-600">Lecture Halls</div>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                            <div className="text-sm text-gray-600">Conflict-Free</div>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
                            <div className="text-sm text-gray-600">Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Use Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Why use the UWU Timetable System?
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

            {/* Tailored for Everyone Section */}
            <section className="py-20 bg-white">
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
                                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop"
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
                                <button className="text-blue-900 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                    View Student Guide
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* For Lecturers */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="h-64 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop"
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
                                <button className="text-blue-900 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                    Lecturer Portal
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
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
                                <button className="text-blue-900 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                    Admin Dashboard
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
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
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Login to Portal
                        </Link>
                        <a
                            href="#help"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-blue-950 font-semibold px-8 py-3.5 rounded-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Support
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white text-gray-700 py-12 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        {/* University Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-950 rounded flex items-center justify-center text-white font-bold text-xl">
                                    U
                                </div>
                                <span className="text-lg font-semibold text-gray-900">Uva Wellassa University</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Badulla Road, Badulla, 90000, Sri Lanka</p>
                            <p className="text-sm text-gray-600 mb-4">
                                The Uva Wellassa System is an innovative timetabling solution designed to enhance technology.
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-900 hover:text-white text-gray-700 rounded-lg flex items-center justify-center transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-yellow-500 hover:text-white text-gray-700 rounded-lg flex items-center justify-center transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-900 hover:text-white text-gray-700 rounded-lg flex items-center justify-center transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* System Links */}
                        <div>
                            <h4 className="text-gray-900 font-semibold mb-4">System</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-900 transition">Dashboard</a></li>
                                <li><a href="#" className="hover:text-blue-900 transition">Public View</a></li>
                                <li><a href="#" className="hover:text-blue-900 transition">Admin Login</a></li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-blue-900 transition">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-900 transition">Report Issue</a></li>
                                <li><a href="#" className="hover:text-blue-900 transition">Contact IT</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600">
                            © {new Date().getFullYear()} Uva Wellassa University. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-blue-900 transition">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-900 transition">Terms of Use</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
