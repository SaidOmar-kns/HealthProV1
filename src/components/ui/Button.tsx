
import React from 'react';
import { Loader2, Check } from 'lucide-react';

import { LucideIcon } from 'lucide-react';
import { CSSProperties } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'theme';
export type ButtonType = 'button' | 'submit';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconPosition = 'start' | 'end';

export interface ButtonStyles {
  button?: CSSProperties;
  text?: CSSProperties;
  startIcon?: CSSProperties;
  endIcon?: CSSProperties;
  loader?: CSSProperties;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  loaded?: boolean;
  loadedIcon?: LucideIcon;
  styles?: ButtonStyles;
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'theme',
  size = 'md',
  type = "button",
  startIcon: StartIcon,
  endIcon: EndIcon,
  isLoading = false,
  loadingText = 'Loading...',
  fullWidth = false,
  className = '',
  disabled,
  loaded = false,
  loadedIcon: LoadedIcon = Check,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = 'inline-flex px-10 items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variantStyles = {
    theme: 'bg-gradient-to-r dark:text-gray-300 from-secondary-500 to-secondary-700 shadow-lg p-2 text-white rounded-lg w-full hover:scale-105 hover:from-secondary-700 hover:to-secondary-500 transition duration-300 ease-in-out',
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-400',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    outline: 'border border-primary-500 dark:border-primary-100 bg-transparent text-primary-500 dark:text-primary-100 hover:bg-primary-700 hover:text-primary-50 hover:dark:border-primary-500 focus:ring-primary-500'
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-sm h-8 px-3 gap-1.5',
    md: 'text-base h-10 px-4 gap-2',
    lg: 'text-lg h-12 px-6 gap-3'
  };

  // Icon sizes
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : 'w-auto';

  // Combine all styles
  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyles}  px-12
    ${className}
  `.trim();

  return (
    <button
      ref={ref}
      type={type}
      className={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2" size={iconSizes[size]} />
          <span>{loadingText}</span>
        </>
      ) : loaded ? (
        <>
          <LoadedIcon size={iconSizes[size]} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {StartIcon && <StartIcon size={iconSizes[size]} className="mr-2" />}
          <span>{children}</span>
          {EndIcon && <EndIcon size={iconSizes[size]} className="ml-2" />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;