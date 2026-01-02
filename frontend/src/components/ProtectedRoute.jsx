import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Frontend UI Guard (NOT SECURITY)
 * 
 * IMPORTANT: This component is ONLY for UI/UX purposes.
 * It provides a better user experience by preventing navigation
 * to pages the user shouldn't access.
 * 
 * SECURITY NOTE: This does NOT provide actual security!
 * A malicious user can bypass this by:
 * - Modifying the JavaScript in browser DevTools
 * - Changing the user.role value in localStorage
 * - Directly navigating to URLs
 * 
 * REAL SECURITY is enforced by the backend:
 * - Every API endpoint validates the JWT token
 * - Backend checks user permissions before returning data
 * - Backend returns 403 Forbidden if user lacks permission
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // UI-level role check (for UX only, not security)
    // Backend will enforce actual authorization
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard instead of showing unauthorized
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
    }

    return <Outlet />;
};

export default ProtectedRoute;
