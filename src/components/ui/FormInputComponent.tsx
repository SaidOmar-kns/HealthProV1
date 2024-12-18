'use client'
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, ChevronUp, X, ChevronDown, Check } from 'lucide-react';

// Type for all possible input types
export type InputType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'textarea';

export type IconPosition = 'start' | 'end';

export type IconType = {
    type: 'fontIcon' | 'image';
    content: React.ReactNode | string;
    position: IconPosition;
};

export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

// Define specific value types for different input types
export type InputValue<T extends InputType> =
    T extends 'checkbox'
    ? boolean | string[]
    : T extends 'number'
    ? number
    : T extends 'select'
    ? string | string[]
    : string;

// Props interface with generic type parameter
export interface FormInputProps<T extends InputType> {
    id: string;
    name: string;
    type: T;
    label?: string;
    value: InputValue<T>;
    onChange: (value: InputValue<T>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    icon?: IconType;
    className?: string;
    options?: SelectOption[];
    min?: number | string;
    max?: number | string;
    step?: number;
    pattern?: string;
    autoComplete?: string;
    multiple?: boolean;
    onSearch?: (searchTerm: string) => void;
    rows?: number;
    cols?: number;
    minLength?: number;
    maxLength?: number;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const FormInputComponent = <T extends InputType>({
    id,
    name,
    type,
    label,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    icon,
    className = '',
    options = [],
    onSearch,
    min,
    max,
    step,
    pattern,
    autoComplete,
    multiple,
    rows = 3,
    cols,
    minLength,
    maxLength,
    resize = 'vertical'
}: FormInputProps<T>) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const baseInputClasses = `
    w-full border p-3 shadow-md dark:bg-primary-900 dark:text-secondary-300 dark:border-primary-800 placeholder:text-base
    focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
    ease-in-out duration-300 border-gray-300 rounded-lg w-full relative z-0
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-primary-300 dark:border-primary-800'}
    ${icon?.position === 'start' ? 'pl-10' : ''}
    ${icon?.position === 'end' ? 'pr-10' : ''}
    ${className}
  `;

    const textareaClasses = `
    ${baseInputClasses}
    ${resize === 'none' ? 'resize-none' : ''}
    ${resize === 'both' ? 'resize' : ''}
    ${resize === 'horizontal' ? 'resize-x' : ''}
    ${resize === 'vertical' ? 'resize-y' : ''}
  `;

    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    }, [searchTerm, onSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setShowDropdown(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedOptionIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedOptionIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedOptionIndex >= 0) {
                    handleOptionSelect(filteredOptions[focusedOptionIndex].value, filteredOptions[focusedOptionIndex].label);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setFocusedOptionIndex(-1);
                break;
        }
    };

    const handleOptionSelect = (optionValue: string, label?: string) => {
        if (multiple) {
            const currentValues: string[] = Array.isArray(value) ? value : [];
            const newValue = currentValues.includes(optionValue)
                ? currentValues.filter(v => v !== optionValue)
                : [...currentValues, optionValue];
            onChange(newValue as InputValue<T>);

            setSearchTerm('');
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } else {
            onChange(optionValue as InputValue<T>);
            setShowDropdown(false);
            setSearchTerm(label ?? '');
        }

    };

    const removeValue = (optionValue: string) => {
        if (Array.isArray(value)) {
            const newValue = value.filter(v => v !== optionValue);
            onChange(newValue as InputValue<T>);
        }
    };

    const getOptionLabel = (optionValue: string) => {
        return options.find(opt => opt.value === optionValue)?.label || optionValue;
    };

    const renderSearchableSelect = () => {
        const isMultiple = multiple && Array.isArray(value);
        const selectedValues: string[] = isMultiple ? value : [];

        return (
            <div className="relative" ref={dropdownRef}>
                {/* Selected Values Chips */}
                {isMultiple && selectedValues.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedValues.map((val) => (
                            <div
                                key={val}
                                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-100 rounded-full px-3 py-1 text-sm"
                            >
                                <span>{getOptionLabel(val)}</span>
                                <button
                                    type="button"
                                    onClick={() => removeValue(val)}
                                    className="hover:text-blue-600 focus:outline-none"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search Input */}
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        className={`${baseInputClasses} ${showDropdown ? 'rounded-b-none' : ''}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || "Search..."}
                        disabled={disabled}

                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {showDropdown ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                </div>

                {/* Dropdown */}
                {showDropdown && (
                    <div className="absolute z-10 w-full mt-0 bg-gray-100 dark:bg-gray-700 border border-t-0 border-gray-300 rounded-b-md shadow-lg max-h-60 overflow-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">No options found</div>
                        ) : (
                            filteredOptions.map((option, index) => {
                                const isSelected = isMultiple
                                    ? selectedValues.includes(option.value)
                                    : value === option.value;

                                return (
                                    <div
                                        key={option.value}
                                        className={`
                      px-4 py-2 cursor-pointer flex items-center justify-between
                      ${isSelected ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-100 hover:text-gray-700 '}
                      ${focusedOptionIndex === index ? 'text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-700' : ''}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                                        onClick={() => !option.disabled && handleOptionSelect(option.value, option.label)}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderIcon = (iconData: IconType) => {
        const iconClasses = `absolute top-1/2 transform -translate-y-1/2 z-10
          ${iconData.position === 'start' ? 'left-3 ' : 'right-3'}`;

        return (
            <div className={iconClasses}>
                {iconData.type === 'image' ? (
                    <Image
                        src={iconData.content as string}
                        alt="input icon"
                        width={20}
                        height={20}
                    />
                ) : (
                    iconData.content
                )}
            </div>
        );
    };




    const renderInput = () => {
        switch (type) {
            case 'select':
                return renderSearchableSelect();

            case 'checkbox':
                return options.length > 0 ? (
                    <div className="space-y-2">
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name={name}
                                    value={option.value}
                                    checked={Array.isArray(value) && value.includes(option.value)}
                                    onChange={(e) => {
                                        if (!Array.isArray(value)) return;
                                        const newValue = e.target.checked
                                            ? [...value, option.value]
                                            : value.filter(v => v !== option.value);
                                        onChange(newValue as InputValue<T>);
                                    }}
                                    disabled={disabled || option.disabled}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <input
                        type="checkbox"
                        id={id}
                        name={name}
                        checked={value as boolean}
                        onChange={(e) => onChange(e.target.checked as InputValue<T>)}
                        disabled={disabled}
                        required={required}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={name}
                                    value={option.value}
                                    checked={value === option.value}
                                    onChange={(e) => onChange(e.target.value as InputValue<T>)}
                                    disabled={disabled || option.disabled}
                                    required={required}
                                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'number':
                return (
                    <input
                        type="number"
                        id={id}
                        name={name}
                        value={value as number}
                        onChange={(e) => onChange(Number(e.target.value) as InputValue<T>)}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        min={min}
                        max={max}
                        step={step}
                        className={baseInputClasses}
                    />
                );

            case 'password':
                return (
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id={id}
                            name={name}
                            value={value as string}
                            onChange={(e) => onChange(e.target.value as InputValue<T>)}
                            placeholder={placeholder}
                            disabled={disabled}
                            required={required}
                            className={`${baseInputClasses} pr-10`}
                            autoComplete={autoComplete}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                                <Eye className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    </div>
                );

            case 'textarea':
                return (
                    <textarea
                        id={id}
                        name={name}
                        value={value as string}
                        onChange={(e) => onChange(e.target.value as InputValue<T>)}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        className={textareaClasses}
                        rows={rows}
                        cols={cols}
                        minLength={minLength}
                        maxLength={maxLength}
                        autoComplete={autoComplete}
                    />
                );

            default:
                return (
                    <input
                        type={type}
                        id={id}
                        name={name}
                        value={value as string}
                        onChange={(e) => onChange(e.target.value as InputValue<T>)}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        min={min}
                        max={max}
                        step={step}
                        pattern={pattern}
                        className={baseInputClasses}
                        autoComplete={autoComplete}
                    />
                );
        }
    };

    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={id} className="block font-medium text-gray-700 dark:text-gray-100">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && icon.position === 'start' && renderIcon(icon)}
                {renderInput()}
                {icon && icon.position === 'end' && renderIcon(icon)}
            </div>

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};

export default FormInputComponent;