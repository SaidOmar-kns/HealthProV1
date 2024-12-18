import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="relative">
                {/* Main spinner */}
                <div className="w-24 h-24">
                    {/* Outer ring */}
                    <div className="absolute w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-700"></div>

                    {/* Spinning element */}
                    <div className="absolute w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

                    {/* Inner ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16">
                        <div className="w-full h-full rounded-full border-4 border-gray-100 dark:border-gray-800 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Loading text */}
            <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading</p>
                <div className="flex space-x-1.5 mt-3 justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;