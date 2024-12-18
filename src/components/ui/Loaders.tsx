'use client'
import React from 'react';

type LoaderVariant = 'spinner' | 'bounce' | 'ripple';

interface LoaderProps {
    variant?: LoaderVariant;
    text?: string;
    size?: 'small' | 'medium' | 'large' | 'extra_small';
    color?: string;
}

const Loader: React.FC<LoaderProps> = ({
    variant = 'spinner',
    text,
    size = 'medium',
    color = '#3b82f6'
}) => {
    const sizeClasses: any = {
        extra_small: 'w-3 h-3',
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const fontClasses: any = {
        extra_small: '.6rem',
        small: '.8rem',
        medium: '1.5rem',
        large: '2rem'
    };

    const renderLoader = () => {
        switch (variant) {
            case 'spinner':
                return (
                    <div className={`${sizeClasses[size]} animate-spin`}>
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke={color}
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill={color}
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                );

            case 'bounce':
                return (
                    <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`${sizeClasses[size]} rounded-full animate-bounce`}
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    backgroundColor: color
                                }}
                            />
                        ))}
                    </div>
                );

            case 'ripple':
                return (
                    <div className="relative">
                        <div
                            style={{ borderColor: color }}
                            className={`${sizeClasses[size]} rounded-full absolute border-4 animate-[ripple_1s_cubic-bezier(0,0.2,0.8,1)_infinite]`}
                        />
                        <div
                            style={{ borderColor: color }}
                            className={`${sizeClasses[size]} rounded-full absolute border-4 animate-[ripple_1s_cubic-bezier(0,0.2,0.8,1)_infinite_-0.5s]`}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {renderLoader()}
            {text && (
                <span className={`text-sm font-medium`} style={{ color: color ?? '', fontSize: fontClasses[size] }}>{text}</span>
            )}
        </div>
    );
};

export default Loader;