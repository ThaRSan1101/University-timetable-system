import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StudentSidebar from '../components/Sidebar';
import LecturerSidebar from '../components/LecturerSidebar';
import AdminSidebar from '../components/AdminSidebar';

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        phone_number: '',
        address: '',
        date_of_birth: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            const profile = user.role === 'student' ? user.student_profile : user.lecturer_profile;
            if (profile) {
                setFormData({
                    phone_number: profile.phone_number || '',
                    address: profile.address || '',
                    date_of_birth: profile.date_of_birth || ''
                });
            }
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const profile = user.role === 'student' ? user.student_profile : user.lecturer_profile;
            const endpoint = user.role === 'student' ? `students/${profile.id}/` : `lecturers/${profile.id}/`;

            await api.patch(endpoint, formData);
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) return <div className="p-8">Loading profile...</div>;

    const profile = user.role === 'student' ? user.student_profile : user.lecturer_profile;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {user.role === 'admin' ? (
                <AdminSidebar />
            ) : user.role === 'lecturer' ? (
                <LecturerSidebar />
            ) : (
                <StudentSidebar />
            )}

            <div className="flex-1 ml-72 overflow-auto">
                <div className="p-8">
                    {/* Header with Title and Custom Profile Card from Image */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-500 mt-1">Manage your account and personal details</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Account Information</h3>
                                </div>

                                <div>
                                    <label className="block text-gray-600 font-bold mb-1">Email Address</label>
                                    <input type="text" value={user.email} disabled className="w-full bg-gray-50 border p-3 rounded-lg text-gray-500" />
                                </div>

                                {user.role === 'student' && (
                                    <>
                                        <div>
                                            <label className="block text-gray-600 font-bold mb-1">Academic Year</label>
                                            <input type="text" value={profile?.year || 'N/A'} disabled className="w-full bg-gray-50 border p-3 rounded-lg text-gray-500" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 font-bold mb-1">Current Semester</label>
                                            <input type="text" value={profile?.semester || 'N/A'} disabled className="w-full bg-gray-50 border p-3 rounded-lg text-gray-500" />
                                        </div>
                                    </>
                                )}

                                {user.role === 'lecturer' && (
                                    <>
                                        <div>
                                            <label className="block text-gray-600 font-bold mb-1">Faculty</label>
                                            <input type="text" value={profile?.faculty || 'N/A'} disabled className="w-full bg-gray-50 border p-3 rounded-lg text-gray-500" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 font-bold mb-1">Department</label>
                                            <input type="text" value={profile?.department || 'N/A'} disabled className="w-full bg-gray-50 border p-3 rounded-lg text-gray-500" />
                                        </div>
                                    </>
                                )}

                                <div className="col-span-full border-t pt-6 mt-2">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800">Personal Details</h3>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        placeholder="+94 7X XXX XXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-bold mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all"
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-gray-700 font-bold mb-1">Residential Address</label>
                                    <textarea
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all"
                                        rows="3"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Enter your address..."
                                    ></textarea>
                                </div>

                                <div className="col-span-full">
                                    {message && (
                                        <div className={`p-4 rounded-lg mb-4 font-bold ${message.includes('Failed') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-900 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-800 transition-all shadow-md active:scale-95"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
