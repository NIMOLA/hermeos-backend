import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '../lib/api-client';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    tier: string;
    kyc?: {
        status: 'pending' | 'verified' | 'rejected';
        verifiedAt?: string;
    };
    role?: 'user' | 'admin';
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    tier?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setToken(storedToken);
                    setUser(parsedUser);
                } catch (error) {
                    console.error('Failed to parse stored user:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    /**
     * Login user
     */
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<{ token: string; user: User }>('/auth/login', {
                email,
                password,
            });

            setToken(response.token);
            setUser(response.user);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Register new user
     */
    const register = async (data: RegisterData) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<{ token: string; user: User }>('/auth/register', data);

            setToken(response.token);
            setUser(response.user);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Optional: Call logout API
        apiClient.post('/auth/logout').catch(() => {
            // Ignore errors on logout
        });
    };

    /**
     * Update user data in state and localStorage
     */
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    /**
     * Refresh user data from API
     */
    const refreshUser = async () => {
        if (!token) return;

        try {
            const response = await apiClient.get<{ user: User }>('/auth/me');
            updateUser(response.user);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // If refresh fails with 401, logout will be handled by api-client
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export default AuthContext;
