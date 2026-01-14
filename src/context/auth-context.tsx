"use client"
import React, { createContext, useContext, useState } from 'react';
import { User, Company, store, UserRole } from '@/lib/store';

type AuthResult = { success: boolean; error?: string };

interface AuthContextType {
    user: User | Company | null;
    isLoading: boolean;
    login: (email: string, role: UserRole) => Promise<AuthResult>;
    signup: (data: Partial<User | Company> & { role: UserRole }) => Promise<AuthResult>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | Company | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, role: UserRole): Promise<AuthResult> => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const found = store.findUserByEmail(email);
        setIsLoading(false);

        if (found) {
            // Simple role check
            if (found.role !== role) {
                // In a real app, strict role check. Here, maybe flexible? No, let's be strict.
                return { success: false, error: `Account exists but not as a ${role}` };
            }
            setUser(found);
            return { success: true };
        }
        return { success: false, error: "Invalid email" };
    };

    const signup = async (data: Partial<User | Company> & { role: UserRole }): Promise<AuthResult> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const existing = store.findUserByEmail(data.email || '');
        if (existing) {
            setIsLoading(false);
            return { success: false, error: "Email already in use" };
        }

        if (data.role === 'USER') {
            const newUser: User = {
                id: `u${Date.now()}`,
                name: data.name || 'New User',
                email: data.email!,
                role: 'USER',
                skills: [],
                bio: '',
                earnings: 0,
                ...data as Partial<User>
            };
            store.createUser(newUser);
            setUser(newUser);
        } else {
            const newCompany: Company = {
                id: `c${Date.now()}`,
                name: data.name || 'New Company',
                email: data.email!,
                role: 'COMPANY',
                ...data as Partial<Company>
            };
            store.createCompany(newCompany);
            setUser(newCompany);
        }

        setIsLoading(false);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
