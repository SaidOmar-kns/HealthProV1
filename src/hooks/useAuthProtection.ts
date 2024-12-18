'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useAuthProtection() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Simulate checking authentication status
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    return {
        isAuthenticated: !!user,
        isLoading
    };
}