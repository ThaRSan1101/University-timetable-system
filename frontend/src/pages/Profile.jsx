import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StudentSidebar from '../components/Sidebar';
import LecturerSidebar from '../components/LecturerSidebar';

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
            // Ideally, we should refresh the user context here to reflect changes immediately
            // But for now, the local state is updated.
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) return <div>Loading...</div>;

    const profile = user.role === 'student' ? user.student_profile : user.lecturer_profile;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {user.role === 'lecturer' ? <LecturerSidebar /> : <StudentSidebar />}

            {/* Main Content */}
            <div className={`flex-1 ${user.role === 'lecturer' ? 'ml-72' : 'ml-64'} overflow-auto`}>
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold uppercase">
                                    {user.username[0]}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">{user.email}</h2>
                                    <p className="opacity-90 capitalize text-lg mt-1">{user.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Read-only Fields */}
                                <div className="col-span-full md:col-span-1">
                                    <label className="block text-gray-600 font-medium mb-1">Email</label>
                                    <input type="text" value={user.email} disabled className="w-full bg-gray-100 border p-3 rounded-lg" />
                                </div>

                                {user.role === 'student' && (
                                    <>
                                        <div>
                                            <label className="block text-gray-600 font-medium mb-1">Year</label>
                                            <input type="text" value={profile?.year} disabled className="w-full bg-gray-100 border p-3 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 font-medium mb-1">Semester</label>
                                            <input type="text" value={profile?.semester} disabled className="w-full bg-gray-100 border p-3 rounded-lg" />
                                        </div>
                                    </>
                                )}

                                {user.role === 'lecturer' && (
                                    <>
                                        <div>
                                            <label className="block text-gray-600 font-medium mb-1">Faculty</label>
                                            <input type="text" value={profile?.faculty} disabled className="w-full bg-gray-100 border p-3 rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 font-medium mb-1">Department</label>
                                            <input type="text" value={profile?.department} disabled className="w-full bg-gray-100 border p-3 rounded-lg" />
                                        </div>
                                    </>
                                )}

                                {/* Editable Fields */}
                                <div className="col-span-full border-t pt-6 mt-2">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Personal Details</h3>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-gray-700 font-medium mb-1">Address</label>
                                    <textarea
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        rows="3"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="123 University Ave..."
                                    ></textarea>
                                </div>

                                <div className="col-span-full">
                                    {message && (
                                        <div className={`p-3 rounded mb-4 ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {message}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
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
