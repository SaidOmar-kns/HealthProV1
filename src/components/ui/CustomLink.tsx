import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

interface CustomLinkProps extends NextLinkProps {
    children: React.ReactNode;
    className?: string;
    isButton?: boolean;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, className, isButton, ...props }) => {
    const defaultClass = 'bg-left-bottom bg-gradient-to-r pt-3 text-sm from-secondary-400 to-secondary-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out';
    const buttonDefaultClass = "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r dark:text-gray-300 from-secondary-500 to-secondary-700 shadow-lg px-5 py-2 text-white rounded-lg w-full hover:scale-105 hover:from-secondary-700 hover:to-secondary-500 transition duration-300 ease-in-out";
    const combinedClassName = className ? `${className}` : (isButton ? buttonDefaultClass : defaultClass);

    return (
        <NextLink href={href} className={combinedClassName} {...props}>
            {children}
        </NextLink>
    );
};

export default CustomLink;