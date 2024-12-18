import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    triggerClassName?: string
}

export default function Dropdown({ trigger, children, className = '', triggerClassName }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({
        top: false,
        right: false
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function updatePosition() {
            if (!dropdownRef.current || !contentRef.current || !isOpen) return;

            const triggerRect = dropdownRef.current.getBoundingClientRect();
            const contentRect = contentRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Check vertical position
            const bottomSpace = viewportHeight - triggerRect.bottom;
            const topSpace = triggerRect.top;
            const dropdownHeight = contentRect.height;

            // Check horizontal position
            const rightSpace = viewportWidth - triggerRect.right;
            const dropdownWidth = contentRect.width;

            setPosition({
                top: bottomSpace < dropdownHeight && topSpace > dropdownHeight,
                right: rightSpace < dropdownWidth
            });
        }

        // Update position when dropdown opens
        if (isOpen) {
            updatePosition();
        }

        // Update position on scroll or resize
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative inline-block ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={triggerClassName ?? `flex items-center gap-2 px-4 py-2 bg-white border dark:bg-gray-900 border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-`}
            >
                {trigger}
            </button>

            {isOpen && (
                <div
                    ref={contentRef}
                    className={`absolute z-10 w-max min-w-full ${position.top ? 'bottom-full mb-2' : 'top-full mt-2'
                        } ${position.right ? 'right-0' : 'left-0'
                        } bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg transition-opacity duration-200`}
                >
                    <div className="py-1">{children}</div>
                </div>
            )}
        </div>
    );
}