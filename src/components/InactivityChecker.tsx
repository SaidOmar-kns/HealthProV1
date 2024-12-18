import React, { useState, useEffect, useCallback } from 'react';

interface InactivityCheckerProps {
    timeout: number; // in milliseconds
    onInactive: () => void;
    children: React.ReactNode;
}

const InactivityChecker: React.FC<InactivityCheckerProps> = ({ timeout, onInactive, children }) => {
    const [lastActivity, setLastActivity] = useState<number>(Date.now());

    const handleActivity = useCallback(() => {
        setLastActivity(Date.now());
    }, []);

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => window.addEventListener(event, handleActivity));

        const interval = setInterval(() => {
            if (Date.now() - lastActivity > timeout) {
                onInactive();
            }
        }, 1000); // Check every second

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            clearInterval(interval);
        };
    }, [handleActivity, lastActivity, onInactive, timeout]);

    return <>{children}</>;
};

// Example usage
const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        // Perform any logout actions here (e.g., clear tokens, redirect)
        console.log('User logged out due to inactivity');
    }, []);

    if (!isLoggedIn) {
        return <div>You have been logged out due to inactivity. Please log in again.</div>;
    }

    return (
        <InactivityChecker timeout={5 * 60 * 1000} onInactive={handleLogout}>
            <div>
                <h1>Welcome to the App</h1>
                <p>You will be logged out after 5 minutes of inactivity.</p>
                {/* Your app content goes here */}
            </div>
        </InactivityChecker>
    );
};

export default App;