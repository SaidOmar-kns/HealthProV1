'use client'

import { encrypt, decrypt } from '@/components/DataEncryption';
import { fetchLoggedInUserDetails, LoggedInUser, loginUser, setLoggedInUser, setToken, updatePassword, updatePasswordRequest } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store/store';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';



interface AuthContextType {
    user: LoggedInUser | null;
    login: (username: string, password: string) => Promise<void>;
    resetPasswordRequest: (email: string,) => Promise<void>;
    resetPassword: (password: string, confirm_password: string, reset_key: string | null | undefined) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const [user, setUser] = useState<LoggedInUser | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(decrypt(storedUser));
            setUser(user);
            dispatch(setToken(user.token));
            dispatch(fetchLoggedInUserDetails(user.uid));
        }
    }, [dispatch]);

    const login = async (email: string, password: string) => {
        try {
            const response = await dispatch(loginUser({ email, password } as any)).unwrap();

            console.log('this is on the auth context', response);
            console.log(response.code)

            if (response.code == 200) {
                const user = {
                    _id: response._id,
                    uid: response.uid,
                    name: response.name,
                    email: response.email,
                    is_active: response.is_active,
                    token: encrypt(response.token),
                };
                dispatch(fetchLoggedInUserDetails(user.uid));
                dispatch(setToken(encrypt(response.token)));
                setUser(user);
                if (process.env.NODE_ENV === 'production') {
                    document.cookie = `authToken=${user.token}; path=/;  SameSite=Strict; Secure`;
                } else {
                    document.cookie = `authToken=${user.token}; path=/;  SameSite=Strict;`;
                }

                localStorage.setItem('user', encrypt(JSON.stringify(user)));
            } else {
                // If the response code is not 200, throw an error
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            // Re-throw the error so it can be caught by the login form
            throw error;
        }
    };

    const resetPasswordRequest = async (email: string) => {
        try {
            const response = await dispatch(updatePasswordRequest({ email } as any)).unwrap();

            if (response.code === 200) {
                return response

            } else {
                // If the response code is not 200, throw an error
                throw new Error(response.message || 'Reset Password Failed');
            }
        } catch (error: any) {
            console.error('Reset Password error:', error);
            // Re-throw the error so it can be caught by the login form
            throw error;
        }
    };

    const resetPassword = async (password: string, confirm_password: string, reset_key: string | null | undefined) => {
        try {
            const response = await dispatch(updatePassword({ password, confirm_password, reset_key } as any)).unwrap();
            if (response.code === 200) {

                //logout the user to enable them to login again
                setUser(null);
                localStorage.removeItem('user');
                document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
                dispatch(setLoggedInUser(null));
                dispatch(setToken(""));
                return response;
            } else {
                // If the response code is not 200, throw an error
                throw new Error(response.message || 'Reset Password Failed');
            }
        } catch (error: any) {
            console.error('Reset Password error:', error);
            // Re-throw the error so it can be caught by the login form
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
        dispatch(setLoggedInUser(null));
        dispatch(setToken(""));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, resetPassword, resetPasswordRequest }}>
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