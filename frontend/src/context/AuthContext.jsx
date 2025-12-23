import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode"; // Need to install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setLoading(false);
    }, []);

    const fetchUser = useCallback(async (id) => {
        try {
            const response = await api.get(`users/${id}/`);
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    const login = async (email, password) => {
        const response = await api.post('auth/login/', { email, password });
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        const decoded = jwtDecode(access);
        await fetchUser(decoded.user_id);
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // We might need to fetch full user details if not in token
                // For now, assume token has user_id and we can fetch or just store basic info
                // Let's fetch user details
                fetchUser(decoded.user_id);
            } catch {
                logout();
            }
        } else {
            setLoading(false);
        }
    }, [fetchUser, logout]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
