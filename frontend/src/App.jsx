import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManageLecturers from './pages/ManageLecturers';
import ManageCourses from './pages/ManageCourses';
import ManageSubjects from './pages/ManageSubjects';
import ManageClassrooms from './pages/ManageClassrooms';
import Profile from './pages/Profile';
import Modules from './pages/Modules';
import Grades from './pages/Grades';
import ProtectedRoute from './components/ProtectedRoute';

// Simple Layout
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <nav className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold">University Timetable</div>
      <div className="flex gap-4 items-center">
        <a href="/" className="hover:underline">Dashboard</a>
        <a href="/profile" className="hover:underline">Profile</a>
        <button onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
      </div>
    </nav>
    <main>{children}</main>
  </div>
);

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'lecturer':
      return <Navigate to="/lecturer" replace />;
    case 'student':
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Wrapper */}
          <Route path="/dashboard" element={<RootRedirect />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/lecturers" element={<Layout><ManageLecturers /></Layout>} />
            <Route path="/admin/courses" element={<Layout><ManageCourses /></Layout>} />
            <Route path="/admin/subjects" element={<Layout><ManageSubjects /></Layout>} />
            <Route path="/admin/classrooms" element={<Layout><ManageClassrooms /></Layout>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
            <Route path="/lecturer" element={<Layout><LecturerDashboard /></Layout>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/grades" element={<Grades />} />
          </Route>

          {/* Shared Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'lecturer', 'student']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
