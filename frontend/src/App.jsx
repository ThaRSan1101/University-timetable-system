import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AdminDashboard from './pages/admin/AdminDashboard';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ManageLecturers from './pages/admin/ManageLecturers';
import ManageCourses from './pages/admin/ManageCourses';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageClassrooms from './pages/admin/ManageClassrooms';
import ManageStudents from './pages/admin/ManageStudents';
import Profile from './pages/Profile';
import Modules from './pages/student/Modules';
import Grades from './pages/student/Grades';
import LecturerAssessments from './pages/lecturer/LecturerAssessments';
import ProtectedRoute from './components/ProtectedRoute';

// Root Redirect Logic
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
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Wrapper */}
          <Route path="/dashboard" element={<RootRedirect />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/lecturers" element={<ManageLecturers />} />
            <Route path="/admin/courses" element={<ManageCourses />} />
            <Route path="/admin/subjects" element={<ManageSubjects />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/classrooms" element={<ManageClassrooms />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
            <Route path="/lecturer" element={<LecturerDashboard />} />
            <Route path="/lecturer/assessments" element={<LecturerAssessments />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/assessments" element={<Grades />} />
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
