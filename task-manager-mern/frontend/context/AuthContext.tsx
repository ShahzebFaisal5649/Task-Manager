'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const response = await authAPI.getMe();
                setUser(response.data.data);
            } catch (error) {
                Cookies.remove('token');
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        const response = await authAPI.login({ email, password });
        const { token, ...userData } = response.data.data;
        Cookies.set('token', token, { expires: 30 });
        setUser(userData);
        router.push('/dashboard');
    };

    const register = async (name: string, email: string, password: string) => {
        const response = await authAPI.register({ name, email, password });
        const { token, ...userData } = response.data.data;
        Cookies.set('token', token, { expires: 30 });
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};