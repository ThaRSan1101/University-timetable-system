import { useAuth } from '../context/AuthContext';
import StudentSidebar from '../components/Sidebar';
import LecturerSidebar from '../components/LecturerSidebar';
import AdminSidebar from '../components/AdminSidebar';

const Profile = () => {
    const { user, loading: authLoading } = useAuth();

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
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-500 mt-1">View your account information</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;