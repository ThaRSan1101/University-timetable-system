import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => { console.error("AuthContext: login called without provider"); },
    logout: () => { console.error("AuthContext: logout called without provider"); }
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await api.post('users/auth/logout/', { refresh: refreshToken });
            }
        } catch (error) {
            console.error("Logout failed on server", error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setLoading(false);
        }
    }, []);

    /**
     * Fetch current user from backend
     * SECURITY: Backend validates JWT and returns user data
     * Frontend NEVER decodes JWT or trusts client-side data
     */
    const fetchCurrentUser = useCallback(async () => {
        try {
            // Backend endpoint that validates JWT and returns authenticated user
            const response = await api.get('auth/me/');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch current user", error);
            // If fetching user fails (invalid/expired token), logout
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    /**
     * Login function
     * SECURITY: Only sends credentials to backend
     * Backend validates and returns tokens + user data
     */
    const login = async (email, password) => {
        // Backend expects 'email' field because User.USERNAME_FIELD is 'email'
        const response = await api.post('auth/login/', { email, password });
        const { access, refresh, user: userData } = response.data;

        // Store tokens (client-side storage only, no logic)
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Set user data returned from backend
        setUser(userData);
        setLoading(false);
    };

    /**
     * Initialize authentication on app load
     * SECURITY: Validates token with backend, doesn't trust localStorage
     */
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                // Don't decode token on frontend!
                // Instead, ask backend to validate it and return user
                await fetchCurrentUser();
            } else {
                setLoading(false);
            }
        };

        initAuth();
    }, [fetchCurrentUser]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
